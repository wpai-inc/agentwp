<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Factories\ClientFactory;
use WpAi\AgentWp\Http\WpAwpClient;

/**
 * Main plugin class
 *
 * Contains a lot of the configuration and common functionality for the plugin.
 * All providers depend on this class.
 *
 * @since 1.3.0
 */
class Main
{
    private static $instance = null;

    const SLUG = 'agentwp';

    const PLUGIN_VERSION = '1.3.0';

    const BUILD_DIR = 'build';

    const ASSET_DIR = 'static';

    const SETTINGS_PAGE = 'agentwp-admin-settings';

    public string $companyName = 'AgentWP';

    public string $attributionUrl = 'https://agentwp.com';

    public Settings $settings;

    public UserAuth $auth;

    public string $pluginUrl;

    public string $settingsPageUrl;

    private string $file;

    public function __construct(string $file)
    {
        $this->file = $file;
        $this->settings = new Settings;
        $this->auth = new UserAuth;
        $this->pluginUrl = plugin_dir_url($this->file);
        $this->settingsPageUrl = admin_url('admin.php?page='.self::SETTINGS_PAGE);
        $this->registerSchedules();
    }

    /**
     * Singleton Accessor
     */
    public static function getInstance($file = null)
    {
        if (self::$instance === null && $file !== null) {
            self::$instance = new self($file);
        }

        return self::$instance;
    }

    public static function prefix(string $string): string
    {
        return self::SLUG.'_'.$string;
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

    public function staticAsset(?string $path = null): string
    {
        return $this->pluginUrl.self::ASSET_DIR.'/'.$path;
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

    public function client(): WpAwpClient
    {
        return new WpAwpClient(ClientFactory::make($this));
    }

    /**
     * @todo: This should maybe be under UserAuth to
     * control access to the access token.
     */
    public function getAccessToken(): ?string
    {
        // return $this->auth->getAccessToken();
        return $this->settings->getAccessToken();
    }

    public function accountSettings(): array
    {
        $res = $this->client()->siteSettingAll();
        if ($res->isError()) {
            return [];
        }

        return $res->get() ?? [];
    }

    public function apiHost()
    {
        return defined('AGENT_WP_SERVER_BASE_URL') ? AGENT_WP_SERVER_BASE_URL : $this->runtimeApiHost();
    }

    public function apiClientHost()
    {
        return defined('AGENT_WP_CLIENT_BASE_URL') && ! empty(AGENT_WP_CLIENT_BASE_URL) ? AGENT_WP_CLIENT_BASE_URL : $this->runtimeApiHost();
    }

    private function runtimeApiHost()
    {
        return defined('AGENTWP_API_HOST') && ! empty(AGENTWP_API_HOST) ? AGENTWP_API_HOST : 'https://app.agentwp.com';
    }

    public function registerSchedules(): void
    {
        add_filter('cron_schedules', function ($schedules) {
            $schedules['every_minute'] = [
                'interval' => 60,
                'display' => __('Every minute', 'agentwp'),
            ];

            return $schedules;
        });
    }
}
