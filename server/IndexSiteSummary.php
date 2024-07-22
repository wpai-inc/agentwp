<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;

class IndexSiteSummary implements Registrable
{
    public function __construct(private Main $main) {}

    public function register()
    {
        add_action('admin_init', [$this, 'send']);
    }

    public function send()
    {
        if ($this->main->siteId()) {
            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }

            $summarizer = new SiteSummarizer();

            if ($summarizer->hasUpdated()) {
                $this->main->client()->summarizeSite(json_encode($summarizer->data()));
            }
        }
    }

    private function getDataForSummarization(): array
    {
        return ['some sample data'];
    }
}
