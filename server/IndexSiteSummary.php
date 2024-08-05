<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Traits\ScheduleEvent;

class IndexSiteSummary implements Registrable
{

    use ScheduleEvent;

    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register(): void
    {
        add_action('admin_init', [$this, 'sendByCron']);
        add_action('agentwp_send_site_summary', [$this, 'send']);
    }

    public function sendByCron(): void
    {
        $this->scheduleSingleCronEvent(
            'agentwp_send_site_summary',
            $this->main::AGENTWP_CRON_THROTTLE
        );
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
