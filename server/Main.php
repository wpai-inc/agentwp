<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Factories\ClientFactory;
use WpAi\AgentWp\Services\AccountSettings;
use WpAi\AgentWp\Services\AwpClient;

/**
 * Main plugin class
 *
 * Contains a lot of the configuration and common functionality for the plugin.
 * All providers depend on this class.
 *
 * @since 0.1.5
 */
class Main
{
    const SLUG = 'agentwp';

    const PLUGIN_VERSION = '0.1.0';

    const BUILD_DIR = 'build';

    public string $companyName = 'AgentWP';

    public string $attributionUrl = 'https://agentwp.com';

    public Settings $settings;

    public UserAuth $auth;

    public string $pluginUrl;

    public string $settingsPage;

    private string $file;

    public function __construct(string $file)
    {
        $this->file = $file;
        $this->settings = new Settings;
        $this->auth = new UserAuth;
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
        return ClientFactory::make($this, $checkUserAccessRights);
    }

    public function accountSettings(): AccountSettings
    {
        return new AccountSettings($this->client());
    }

    private function runtimeApiHost()
    {
        return defined('AGENTWP_API_HOST') ? AGENTWP_API_HOST : 'https://app.agentwp.com';
    }
}
