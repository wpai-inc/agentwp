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

    private Settings $settings;

    private UserAuth $auth;

    public function __construct(private string $file)
    {
        $this->settings = new Settings();
        $this->auth = new UserAuth();
        $this->clientId = $this->settings->client_id;
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
        return $this->url(self::BUILD_DIR . '/' . $path);
    }

    public function pluginPath(): string
    {
        return $this->file;
    }

    public function path(?string $path = null): string
    {
        return plugin_dir_path($this->file) . ltrim($path, '/');
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
            'nonce' => wp_create_nonce(self::nonce()),
            'is_admin' => $this->auth->isAdmin(),
            'agentwp_manager' => $this->auth->isManager(),
            'agentwp_users_manager' => $this->auth->canManageUsers(),
            'agentwp_access' => $this->auth->hasAccess(),
            'access_token' => $this->auth->getAccessToken(),
            'site_id' => $this->siteId(),
            'client_id' => $this->clientId,
            'api_host' => $this->apiClientHost(),
            'user' => wp_get_current_user()->data,
            'onboard_completed' => $this->settings->onboarding_completed,
        ];
?>
        <script>
            const agentwp_settings = <?php echo json_encode($agentwp_settings); ?>;
        </script>
<?php
    }

    private function runtimeApiHost()
    {
        return defined('AGENTWP_API_HOST') ? AGENTWP_API_HOST : 'https://api.agentwp.com';
    }
}
