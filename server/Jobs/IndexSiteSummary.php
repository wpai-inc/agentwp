<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Contracts\IndexableData;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;

class IndexSiteSummary extends Job implements Registrable, IndexableData
{
    private Main $main;

    public function register()
    {
        parent::register();
    }

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function send(): void
    {
        if ((defined('DOING_AJAX') && DOING_AJAX) || !$this->main->siteId()) {
            return;
        }

        $summarizer = new SiteSummarizer;
        if ( ! $summarizer->hasUpdated()) {
            return;
        }

        $this->main->client(false)->summarizeSite(json_encode($summarizer->getData()));
    }

    private function getDataForSummarization(): array
    {
        return [];
    }

    public function eventName(): string
    {
        return 'agentwp_send_site_summary';
    }
}
