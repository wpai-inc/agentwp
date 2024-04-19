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

    /**
     * Temporary for demo,
     * before auth is implemented.
     */
    public string $siteId = '9bd7360f-6aeb-4204-b1a6-624d004701a3';

    public function __construct(private string $file)
    {
    }

    public function buildPath(): string
    {
        return $this->path(self::BUILD_DIR);
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
}
