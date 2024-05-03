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
    public string $siteId = '9bf34f11-304c-42c8-8b80-54b6628fe151';

    public string $token = 'eyJpdiI6Imc3bnJaM3RrN2tBYmREd3lMQlpIVUE9PSIsInZhbHVlIjoiNXM1T1ZpbGZpV0ZpZVBQK3VUYThKUDZYR2ZIQkpxa2RkUVVrZXZzZnBtQ1NBeWtNTU53STlwQWJJVGttVVh0Tk1WTUVZY1VtWHBXcHdvaUFDcVhiUFE9PSIsIm1hYyI6ImUxNDBmMzVhYzViNGZjMmY2ZGViNzVmNmExNWJhNThlY2Q4NGU5MzA0N2ZhOGM5YjE4NzRhY2NhYzhhN2YzN2YiLCJ0YWciOiIifQ==';

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
