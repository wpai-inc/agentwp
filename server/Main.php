<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Services\AwpClient;
use WpAi\AgentWp\Services\AwpRestRoute;

/**
 * Main plugin class
 *
 * Contains a lot of the configuration and common functionality for the plugin.
 * All providers depend on this class.
 *
 * @since 0.1.0
 */
class Main
{
    const SLUG = 'agentwp';

    const PLUGIN_VERSION = '0.1.0';

    const BUILD_DIR = 'build';

    const AGENTWP_CRON_THROTTLE = 300;

    public $companyName = 'Agent WP';

    public $attributionUrl = 'https://agentwp.com';

    public Settings $settings;

    public UserAuth $auth;

    private ?string $clientId;

    public string $pluginUrl;

    public string $settingsPage;

    public function __construct(private string $file)
    {
        $this->settings = new Settings();
        $this->auth = new UserAuth();
        $this->clientId = $this->settings->client_id;
        add_action('admin_head', [$this, 'pageData']);
        $this->pluginUrl = plugin_dir_url($this->file);
        $this->settingsPage = admin_url('options-general.php?page=agentwp-admin-settings');
    }

    public function buildPath(): string
    {
        return $this->path(self::BUILD_DIR);
    }

    public function siteId(): ?string
    {
        return $this->settings->site_id;
    }

    public function auth(): UserAuth
    {
        return $this->auth;
    }

    public function asset(?string $path = null): string
    {
        return $this->url(self::BUILD_DIR.'/'.$path);
    }

    public function pluginPath(): string
    {
        return $this->file;
    }

    public function path(?string $path = null): string
    {
        return plugin_dir_path($this->file).ltrim($path, '/');
    }

    public function url(?string $path = null): string
    {
        return plugins_url($path, $this->file);
    }

    public static function nonce(): string
    {
        return self::SLUG;
    }

    public function apiHost()
    {
        return Helper::config('AGENT_WP_SERVER_BASE_URL') ?? $this->runtimeApiHost();
    }

    public function apiClientHost()
    {
        return Helper::config('AGENT_WP_CLIENT_BASE_URL') ?? $this->runtimeApiHost();
    }

    public function client($checkUserAccessRights = true): AwpClient
    {
        $client = new AwpClient();
        if (! $checkUserAccessRights && $access_token = $this->settings->getAccessToken()) {
            $client->setToken($access_token);
        } elseif ($access_token = $this->auth()->getAccessToken()) {
            $client->setToken($access_token);
        }
        $client->setWpUser(wp_get_current_user())
            ->setSiteId($this->siteId())
            ->setApiHost($this->apiHost());

        return $client;
    }

    public function pageData()
    {
        $current_user_data = wp_get_current_user()->data;
        // only keep the necessary data
        $current_user = [
            'ID' => $current_user_data->ID,
            'user_email' => $current_user_data->user_email,
            'user_login' => $current_user_data->user_login,
            'user_nicename' => $current_user_data->user_nicename,
            'display_name' => $current_user_data->display_name,
            'avatar_url' => get_avatar_url($current_user_data->ID),
            'roles' => wp_get_current_user()->roles,
        ];

        $agentwp_settings = [
            'home_url' => home_url(),
            'plugin_url' => $this->pluginUrl,
            'settings_page' => $this->settingsPage,
            'rest_endpoint' => AwpRestRoute::REST_ROUTE_ENDPOINT,
            'rest_route' => rest_url(),
            'admin_route' => admin_url(),
            'nonce' => wp_create_nonce(self::nonce()),
            'wp_rest_nonce' => wp_create_nonce('wp_rest'),
            'is_admin' => $this->auth->isAdmin(),
            'agentwp_manager' => $this->auth->isManager(),
            'agentwp_users_manager' => $this->auth->canManageUsers(),
            'agentwp_access' => $this->auth->hasAccess(),
            'access_token' => $this->auth->getAccessToken(),
            'refresh_token' => $this->auth->getRefreshToken(),
            'site_id' => $this->siteId(),
            'client_id' => $this->clientId,
            'api_host' => $this->apiClientHost(),
            'user' => $current_user,
            'onboarding_completed' => $this->settings->onboarding_completed,
        ];
        ?>
        <script>
            const agentwp_settings = <?php echo json_encode($agentwp_settings); ?>;
        </script>
        <style>
            body.agentwp-admin-settings {
                background-color: #ffffff;
            }

            .agentwp-components-snackbar-list {
                position: fixed;
                top: 38px;
                right: 32px;
                display: flex;
                flex-direction: column-reverse;
                align-items: flex-end;
            }

            .agentwp-components-snackbar-list-left {
                left: 32px;
                right: unset;
            }

            .components-snackbar {
                padding: 10px 40px;
                color: #fff;
            }

            .agentwp-error-notification {
                background: #ab0909;
            }

            .agentwp-info-notification {
                background: #646464;
            }

            .agentwp-default-notification {
                background: #0e876a;
            }
        </style>
<?php
    }

    private function runtimeApiHost()
    {
        return defined('AGENTWP_API_HOST') ? AGENTWP_API_HOST : 'https://app.agentwp.com';
    }
}
