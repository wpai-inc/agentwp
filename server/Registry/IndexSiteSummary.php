<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Cacheable;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Traits\HasCache;
use WpAi\AgentWp\Traits\HasScheduler;

class IndexSiteSummary implements Cacheable, Registrable
{
    use HasCache, HasScheduler;

    private Main $main;

    private SiteSummarizer $summarizer;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->summarizer = new SiteSummarizer;

        if (! function_exists('is_plugin_active')) {
            require_once ABSPATH.'wp-admin/includes/plugin.php';
        }
    }

    public function register(): void
    {
        $this->registerActionSchedules(['autoUpdate']);
        add_action('init', [$this, 'checkCache']);
    }

    public static function cacheId(): string
    {
        return 'site_summary';
    }

    public function autoUpdate(): void
    {
        if (! $this->main->siteId() || (defined('DOING_AJAX') && DOING_AJAX)) {
            return;
        }

        $cache = $this->cache($this->summarizer->data());

        if (! $cache->hit()) {
            $this->send($cache->getData());
        }
    }

    public function send(array $data): void
    {
        $this->main->client()->siteSummarize($data);
    }

    public function checkCache(): void
    {
        if (! $this->cache()->hasCache()) {
            $this->scheduleNow('autoUpdate');
        }
    }
}
