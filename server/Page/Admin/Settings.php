<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;
use WpAi\AgentWp\UserAuth;

class Settings extends ReactClient
{
    use HasMenu, HasPage;

    public array $pageData = [];

    protected array $locations = [
        \WpAi\AgentWp\Client\Locations\Settings::class,
    ];

    public function __construct(Main $main)
    {
        parent::__construct($main);
        add_action('current_screen', [$this, 'maybe_get_token']);
    }

    public function registrations(): void
    {
        $subpages = [];
        if ($this->settings->isConnected() && $this->settings->onboarding_completed) {
            $subpages = [
                [
                    'name' => 'AI Connection Manager',
                    'slug' => 'settings',
                    'data' => [],
                ],
                [
                    'name' => 'Users',
                    'slug' => 'users',
                    'data' => [],
                ],
                [
                    'name' => 'Settings',
                    'slug' => 'settings',
                    'data' => [],
                ],
                [
                    'name' => 'Open Chat',
                    'slug' => 'dashboard',
                    'data' => [],
                ],
            ];
        }

        $this->hasFooter()->registerPage();
        $this
            ->icon($this->main->staticAsset('icon.svg'))
            ->position(4)
            ->menuName('AgentWP')
            ->subPages($subpages)
            ->registerMenu();
    }

    public function openChatListener(): void
    {
        wp_enqueue_script('agentwp-admin', $this->main->staticAsset('/admin.js'), [], $this->main::PLUGIN_VERSION, true);
    }

    public function data(): array
    {
        return [];
    }

    public function maybe_get_token(): void
    {
        $screen = get_current_screen();

        if ($screen->id === 'toplevel_page_agentwp-admin-settings' && isset($_GET['code'])) {
            $code = sanitize_text_field($_GET['code']);
            $response_raw = wp_remote_post($this->main->apiHost().'/oauth/token', [
                'body' => [
                    'grant_type' => 'authorization_code',
                    'client_id' => $this->main->settings->client_id,
                    'client_secret' => $this->main->settings->client_secret,
                    'redirect_uri' => $this->main->settingsPage,
                    'code' => $code,
                ],
            ]);

            $response = json_decode($response_raw['body'], true);

            $response['expires_in'] = $response['expires_in'] * 1000;

            $current_user = wp_get_current_user();
            $current_user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);

            if ($response['access_token']) {
                $this->main->settings->setAccessToken($response);
            }
            wp_redirect(admin_url('admin.php?page=agentwp-admin-settings'));
        }
    }
}
