<?php

namespace WpAi\AgentWp\Page\Admin;

use Laravel\Passport\Passport;
use WpAi\AgentWp\Factory\AwpClientFactory;
use WpAi\AgentWp\ReactClient;
use WpAi\AgentWp\Services\AwpRestRoute;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;
use WpAi\AgentWp\UserAuth;

class Settings extends ReactClient
{
    use HasMenu, HasPage;

    public $pageData = [];
    private \WpAi\AgentWp\Services\AwpClient $awpClient;
    private \WpAi\AgentWp\Settings $settings;
    private UserAuth $user;

    public function __construct(\WpAi\AgentWp\Main $main)
    {
        parent::__construct($main);

        $this->settings  = new \WpAi\AgentWp\Settings();
        $this->user      = new UserAuth();
        $this->awpClient = AwpClientFactory::create($this->main);

        add_action('current_screen', [$this, 'maybe_get_token']);

        new AwpRestRoute('agentwp_generate_unique_verification_key', [$this, 'generate_unique_verification_key'], [$this->user, 'canGenerateVerificationKey']);

        new AwpRestRoute('agentwp_validate_website', [$this, 'validate_website'], [$this->user, 'hasValidVerificationKey']);

        (new AwpRestRoute('agentwp_save_connection', [$this, 'save_connection'], [$this->user, 'hasValidVerificationKey']))->method('POST');

        new AwpRestRoute('agentwp_logout', [$this, 'logout'], UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);

        new AwpRestRoute('agentwp_disconnect_site', [$this, 'disconnect_site'], UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);

        (new AwpRestRoute('agentwp_manual_activation', [$this, 'manual_activation'], [$this->user, 'canGenerateVerificationKey']))->method('POST');
    }

    public function registrations(): void
    {
        $this->hasFooter()->registerPage();
        $this->menuName('Agent WP Settings')->registerMenu();
    }

    public function generate_unique_verification_key(): void
    {
        $key = uniqid('agentwp-', true);
        $this->settings->set('verification_key', $key);
        wp_send_json([
            'key'      => $key,
            'home_url' => home_url(),
        ]);
    }

    public function validate_website(): void
    {
        $key = sanitize_text_field($_REQUEST['verification_key']);
        if (
            $this->settings->verification_key
            && ! empty($key)
            && $key === $this->settings->verification_key
        ) {
            wp_send_json([
                'status' => 'success',
            ]);
        } else {
            wp_send_json_error([
                'status' => 'failed',
            ]);
        }
    }

    public function save_connection(): void
    {

        $key = sanitize_text_field($_REQUEST['verification_key'] ?? '');
        if (
            ! $this->settings->verification_key
            || empty($key)
               && $key !== $this->settings->verification_key
        ) {
            wp_send_json_error([
                'status' => 'failed',
            ]);
        }

        $this->settings->delete('verification_key');

        $data = json_decode(file_get_contents('php://input'), true);

        $this->settings->set([
            'site_id'       => sanitize_text_field($data['site_id']),
            'client_id'     => sanitize_text_field($data['client_id']),
            'client_secret' => sanitize_text_field($data['client_secret']),
        ]);


        // Make the current user an AWP users manager
        $user_email = sanitize_text_field($data['user_email']);
        $user       = get_user_by('email', $user_email);

        $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);
        $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_USERS);
        $user->add_cap(UserAuth::CAP_AGENTWP_ACCESS);

        wp_send_json([
            'status' => 'success',
        ]);
    }

    public function maybe_get_token(): void
    {
        $screen = get_current_screen();
        if ($screen->id === 'settings_page_agent-wp-admin-settings' && isset($_GET['code'])) {
            $code         = sanitize_text_field($_GET['code']);
            $response_raw = wp_remote_post($this->main->apiHost().'/oauth/token', [
                'body' => [
                    'grant_type'    => 'authorization_code',
                    'client_id'     => $this->settings->client_id,
                    'client_secret' => $this->settings->client_secret,
                    'redirect_uri'  => admin_url('options-general.php?page=agent-wp-admin-settings'),
                    'code'          => $code,
                ],
            ]);
            $response     = json_decode($response_raw['body'], true);

            $response['expires_in'] = $response['expires_in'] * 1000;

            $current_user = wp_get_current_user();
            $current_user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);

            if ($response['access_token']) {
                $this->settings->setAccessToken($response);
            }
            wp_redirect(admin_url('options-general.php?page=agent-wp-admin-settings'));
        }
    }

    public function logout(): void
    {
        $this->revoke_api_token();
        $this->settings->delete(['token', 'verification_key']);
        wp_send_json_success();
    }

    public function disconnect_site(): void
    {
        $this->revoke_api_token();
        $this->settings->delete(['site_id', 'client_id', 'client_secret', 'token', 'verification_key']);
        wp_send_json_success();
    }

    private function revoke_api_token(): void
    {
        $this->awpClient->request('POST', $this->main->apiHost().'/api/site/disconnect');
    }

    public function manual_activation(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $data = json_decode(base64_decode($data['apiKey']), true);

        if(!$data['site_id'] || !$data['client_id'] || !$data['client_secret'] || !$data['token']['access_token'] || !$data['token']['expires_in']){
            wp_send_json_error([
                'message' => 'Invalid data',
            ]);
        }

        $this->main->settings->set([
            'site_id'       => sanitize_text_field($data['site_id']),
            'client_id'     => sanitize_text_field($data['client_id']),
            'client_secret' => sanitize_text_field($data['client_secret']),
        ]);
        $this->main->settings->setAccessToken([
            'access_token'  => sanitize_text_field($data['token']['access_token']),
            'token_type'    => 'Bearer',
            'refresh_token' => '',
            'expires_in'    => sanitize_text_field($data['token']['expires_in']),
        ]);

        wp_send_json_success([
            'settings' => $this->main->settings->data,
        ]);
    }
}
