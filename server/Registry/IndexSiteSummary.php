<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Traits\ScheduleEvent;

class IndexSiteSummary implements Registrable
{
    use ScheduleEvent;

    private Main $main;

    private SiteSummarizer $summarizer;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->summarizer = new SiteSummarizer;
    }

    public function register(): void
    {
        add_action('admin_init', [$this, 'sendByCron']);
        add_action('agentwp_send_site_summary', [$this, 'autoUpdate']);
    }

    public function sendByCron(): void
    {
        $this->scheduleSingleCronEvent(
            'agentwp_send_site_summary',
            $this->main::AGENTWP_CRON_THROTTLE
        );
    }

    public function autoUpdate(): void
    {
        if ($this->main->siteId() || (defined('DOING_AJAX') && DOING_AJAX)) {
            return;
        }

        if ($this->summarizer->hasUpdated()) {
            $this->send();
        }
    }

    public function send(): void
    {
        $this->main->client(false)->summarizeSite(json_encode($this->summarizer->data()));
    }
}
