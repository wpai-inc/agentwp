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
    public string $siteId = '9be4d289-ec6a-429e-9ae8-b673befcab77';

    public string $token = 'eyJpdiI6Im5ZQzJ3U3FkUmpscUpjeE9yMVJjbWc9PSIsInZhbHVlIjoiRDVDc3RtOGVpRXJDVnBTR2Z5OC9PUi82TWZUbGR0enpNNlRJN05Pb1I3V3lrV01xa3l1OG9RMnkyTnRXNEtFTUoyYkZqaC9GQ1duL0R2Um5yOWdQcGc9PSIsIm1hYyI6IjJiNmJmMzM0MTNlY2RlNDYwZWRmZThmZWY3MDc1NmYzMjgxYjI2NzZkMGI1MGIzODlkYWY1Yzg4MmMyN2Y2NWEiLCJ0YWciOiIifQ==';

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
