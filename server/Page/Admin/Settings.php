<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;
use WpAi\AgentWp\UserAuth;

class Settings extends ReactClient
{
    use HasMenu, HasPage;

    public array $pageData = [];

    private \WpAi\AgentWp\Settings $settings;

    private UserAuth $user;

    public function __construct(\WpAi\AgentWp\Main $main)
    {
        parent::__construct($main);

        $this->settings = new \WpAi\AgentWp\Settings;
        $this->user = new UserAuth;

        add_action('current_screen', [$this, 'maybe_get_token']);
    }

    public function registrations(): void
    {
        $this->hasFooter()->registerPage();
        $this->menuName('Agent WP Settings')->registerMenu();
    }

    public function data(): array
    {
        return [];
    }

    public function maybe_get_token(): void
    {
        $screen = get_current_screen();
        if ($screen->id === 'settings_page_agentwp-admin-settings' && isset($_GET['code'])) {
            $code = sanitize_text_field($_GET['code']);
            $response_raw = wp_remote_post($this->main->apiHost().'/oauth/token', [
                'body' => [
                    'grant_type' => 'authorization_code',
                    'client_id' => $this->settings->client_id,
                    'client_secret' => $this->settings->client_secret,
                    'redirect_uri' => $this->main->settingsPage,
                    'code' => $code,
                ],
            ]);
            $response = json_decode($response_raw['body'], true);

            $response['expires_in'] = $response['expires_in'] * 1000;

            $current_user = wp_get_current_user();
            $current_user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);

            if ($response['access_token']) {
                $this->settings->setAccessToken($response);
            }
            wp_redirect(admin_url('options-general.php?page=agentwp-admin-settings'));
        }
    }
}
