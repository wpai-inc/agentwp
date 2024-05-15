<?php

namespace WpAi\AgentWp;

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
    const SLUG = 'agent-wp';

    const PLUGIN_VERSION = '0.1.0';

    const BUILD_DIR = 'build';

    public $companyName = 'Agent WP';

    public $attributionUrl = 'https://agentwp.com';

    private ?string $clientId;

    public Settings $settings;

    private UserAuth $auth;
    public string $pluginUrl;

    public function __construct(private string $file)
    {
        $this->settings  = new Settings();
        $this->auth      = new UserAuth();
        $this->clientId  = $this->settings->client_id;
        $this->pluginUrl = plugin_dir_url($this->file);
        add_action('admin_head', [$this, 'printDefaultVars']);
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

    public function printDefaultVars()
    {
        $agentwp_settings = [
            'home_url'              => home_url(),
            'plugin_url'            => $this->pluginUrl,
            'nonce'                 => wp_create_nonce(self::nonce()),
            'wp_rest_nonce'         => wp_create_nonce('wp_rest'),
            'is_admin'              => $this->auth->isAdmin(),
            'agentwp_manager'       => $this->auth->isManager(),
            'agentwp_users_manager' => $this->auth->canManageUsers(),
            'agentwp_access'        => $this->auth->hasAccess(),
            'access_token'          => $this->auth->getAccessToken(),
            'site_id'               => $this->siteId(),
            'client_id'             => $this->clientId,
            'api_host'              => $this->apiClientHost(),
            'rest_route'            => rest_url(),
            'user'                  => wp_get_current_user()->data,
            'onboarding_completed'  => $this->settings->onboarding_completed,
        ];
        ?>
        <script>
            const agentwp_settings = <?php echo json_encode($agentwp_settings); ?>;
        </script>
        <style>
            body.agent-wp-admin-settings {
                background-color: #ffffff;
            }
        </style>
        <?php
    }

    private function runtimeApiHost()
    {
        return defined('AGENTWP_API_HOST') ? AGENTWP_API_HOST : 'https://api.agentwp.com';
    }

    public function verify_nonce()
    {
        if ( ! wp_verify_nonce($_GET['agentwp_nonce'], self::SLUG)) {
            wp_send_json_error('Invalid nonce');
        }
    }
}
