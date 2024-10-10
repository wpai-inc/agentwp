<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Cacheable;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\HasCache;
use WpAi\AgentWp\Traits\HasScheduler;

class IndexThemeJson implements Cacheable, Registrable
{
    use HasCache, HasScheduler;

    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register(): void
    {
        $this->registerActionSchedules(['autoUpdate']);
    }

    public static function cacheId(): string
    {
        return 'site_theme_json';
    }

    public function autoUpdate(): void
    {
        if (! $this->main->siteId() || (defined('DOING_AJAX') && DOING_AJAX)) {
            return;
        }



        $cache = $this->cache($this->getThemeJson());

        if (! $cache->hit()) {
            $this->send($cache->getData());
        }
    }

    public function send(array $data): void
    {
        $this->main->client()->siteThemeJson($data);
    }

    public function checkCache(): void
    {
        if (! $this->cache()->hasCache()) {
            $this->scheduleNow('autoUpdate');
        }
    }

    private function getThemeJson(): array
    {
        if (! class_exists('WP_Theme_JSON_Resolver')) {
            return [];
        }

        $theme_json = \WP_Theme_JSON_Resolver::get_merged_data()->get_raw_data();

        // Ensure we're returning an array
        return is_array($theme_json) ? $theme_json : [];
    }
}
