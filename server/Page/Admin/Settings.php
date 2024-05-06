<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;

class Settings extends ReactClient
{
    use HasMenu, HasPage;

    public $pageData = [];

    public function __construct(\WpAi\AgentWp\Main $main)
    {
        parent::__construct($main);

        add_action('current_screen', [$this, 'maybe_get_token']);

        add_action('wp_ajax_agentwp_generate_unique_verification_key', [$this, 'generate_unique_verification_key']);
        add_action('wp_ajax_nopriv_agentwp_validate_website', [$this, 'validate_website']);
        add_action('wp_ajax_nopriv_agentwp_save_connection', [$this, 'save_connection']);

        add_action('plugins_loaded', [$this, 'get_site_users']);

        add_action('wp_ajax_agentwp_update_user', [$this, 'update_user_capabilities']);

        add_action('wp_ajax_agentwp_logout', [$this, 'logout']);
    }

    public function registrations(): void
    {
        $this->hasFooter()->registerPage();
        $this->menuName('Agent WP Settings')->registerMenu();
    }

    public function get_agentwp_settings(): void
    {
        $settings = get_option('agentwp_settings');
        if ( ! $settings) {
            $settings = [
                'api_key' => '',
            ];
        }
        wp_send_json($settings);
    }

    public function save_agentwp_settings($request): void
    {
        $settings = json_decode($request->get_body(), true);
        update_option('agentwp_settings', $settings);
        wp_send_json($settings);
    }

    public function check_api_key(): void
    {
    }

    public function generate_unique_verification_key(): void
    {
        $key = uniqid();
        update_option('agentwp_verification_key', $key);
        wp_send_json([
            'key'      => $key,
            'home_url' => home_url(),
        ]);
    }

    public function validate_website(): void
    {
        $key              = sanitize_text_field($_GET['uid']);
        $verification_key = get_option('agentwp_verification_key');
        if ($key === $verification_key) {
            wp_send_json([
                'status' => 'success',
            ]);
        } else {
            wp_send_json([
                'status' => 'failed',
            ]);
        }
    }

    public function save_connection(): void
    {

        if (empty($_GET['uid'])) {
            wp_send_error([
                'status' => 'failed',
            ]);
        }
        $key              = sanitize_text_field($_GET['uid']);
        $verification_key = get_option('agentwp_verification_key');

        if ($key !== $verification_key) {
            wp_send_error([
                'status' => 'failed',
            ]);
        }

        delete_option('agentwp_verification_key');

        $request       = file_get_contents('php://input');
        $data          = json_decode($request, true);
        $site_id       = $data['site_id'];
        $client_id     = $data['client_id'];
        $client_secret = $data['client_secret'];

        update_option('agentwp_site_id', [
            'site_id'       => $site_id,
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
        ]);

        // Make the current user an AWP users manager
        $user = get_user_by('email', $_GET['user_email']);

        $user->add_cap('manage_agentwp_users');
        $user->add_cap('agentwp_access');

        wp_send_json([
            'status' => 'success',
        ]);

    }

    public function maybe_get_token(): void
    {
        $screen = get_current_screen();
        if ($screen->id === 'settings_page_agent-wp-admin-settings' && isset($_GET['code'])) {
            $site_id  = get_option('agentwp_site_id');
            $response = wp_remote_post($this->main->apiHost() . '/oauth/token', [
                'body' => [
                    'grant_type'    => 'authorization_code',
                    'client_id'     => $site_id['client_id'],
                    'client_secret' => $site_id['client_secret'],
                    'redirect_uri'  => admin_url('options-general.php?page=agent-wp-admin-settings'),
                    'code'          => $_GET['code'],
                ],
            ]);
            $response = json_decode($response['body'], true);

            $response['expires_in'] = $response['expires_in'] * 1000;

            $current_user = wp_get_current_user();
            $current_user->add_cap('agentwp_manager');

            if ($response['access_token']) {
                // of module openssl is enabled
                if (extension_loaded('openssl')) {
                    $response['access_token']  = openssl_encrypt($response['access_token'], 'aes-256-cbc', AUTH_KEY, 0, AUTH_KEY);
                    $response['refresh_token'] = openssl_encrypt($response['refresh_token'], 'aes-256-cbc', AUTH_KEY, 0, AUTH_KEY);
                }
                update_option('agentwp_access_token', $response, false);
            }
            wp_redirect(admin_url('options-general.php?page=agent-wp-admin-settings'));
        }
    }

    public function get_site_users(): void
    {
        $users = get_users([
            'role__in' => ['administrator', 'editor', 'author', 'contributor', 'subscriber'],
            'fields'   => ['ID', 'user_email', 'display_name'],
        ]);
        foreach ($users as $user) {
            $user->manage_agentwp_users = user_can($user->ID, 'manage_agentwp_users');
            $user->agentwp_access       = user_can($user->ID, 'agentwp_access');
        }

        $this->pageData['users'] = $users;

    }

    public function update_user_capabilities(): void
    {
        if ( ! wp_verify_nonce($_GET['nonce'], 'agentwp_settings')) {
            wp_send_json_error('Invalid nonce');
        }

        $data    = json_decode(file_get_contents('php://input'), true);
        $user_id = sanitize_text_field($data['user']);
        $user    = new \WP_User($user_id);
        if (isset($data['agentwp_access'])) {
            $agentwp_access = sanitize_text_field($data['agentwp_access']);
            if ($agentwp_access) {
                $user->add_cap('agentwp_access');
            } else {
                $user->remove_cap('agentwp_access');
            }
        } elseif (isset($data['manage_agentwp_users'])) {
            $manage_agentwp_users = sanitize_text_field($data['manage_agentwp_users']);
            if ($manage_agentwp_users) {
                $user->add_cap('manage_agentwp_users');
            } else {
                $user->remove_cap('manage_agentwp_users');
            }
        }
        wp_send_json_success();
    }

    public function logout(): void
    {
        delete_option('agentwp_access_token');
        wp_send_json_success();
    }
}
