<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;

class IndexSiteSummary implements Registrable
{
    public function __construct(private Main $main) {}

    public function register(): void
    {
        add_action('admin_init', [$this, 'sendByCron']);
        add_action('agentwp_send_site_summary', [$this, 'send']);
    }

    public function sendByCron(): void
    {
        if (!wp_next_scheduled('agentwp_send_site_summary')) {
            wp_schedule_single_event(time(), 'agentwp_send_site_summary');
        }
    }

    public function send(): void
    {
        if ($this->main->siteId()) {
            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }
            $summarizer = new SiteSummarizer();
            // var_dump($summarizer->data());

            if ($summarizer->hasUpdated()) {
                $this->main->client(false)->summarizeSite(json_encode($summarizer->data()));
            }
        }
    }

    private function getDataForSummarization(): array
    {
        return ['some sample data'];
    }
}
