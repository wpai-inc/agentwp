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
    }

    public function register(): void
    {
        $this->registerActionSchedules(['autoUpdate']);
        add_action('plugins_loaded', [$this, 'checkCache']);
    }

    public static function cacheId(): string
    {
        return 'site_summary';
    }

    public function autoUpdate(): void
    {
        wp_die('autoUpdate');
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
        $this->main->client(false)->summarizeSite(json_encode($data));
    }

    public function checkCache(): void
    {
        error_log('checkCache');
        if (! $this->cache()->hasCache()) {
            $this->autoUpdate();
        }
    }
}
