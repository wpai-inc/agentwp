<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Traits\ScheduleEvent;

class IndexSiteSummary implements Registrable
{
    use ScheduleEvent;

    const CRON_THROTTLE = 30;

    const CRON_INTERVAL = 'perminute';

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
            self::CRON_THROTTLE
        );
    }

    public function schedule(): void
    {
        $intervalJob = 'agentwp_send_site_summary_everyminute';
        if (! wp_next_scheduled($intervalJob)) {
            wp_schedule_event(time(), 'every_minute', $intervalJob);
        }
        add_action($intervalJob, [$this, 'autoUpdate']);
    }

    public static function cleanUpSchedule(): void
    {
        $timestamp = wp_next_scheduled('agentwp_send_site_summary_everyminute');
        if ($timestamp) {
            wp_unschedule_event($timestamp, 'agentwp_send_site_summary_everyminute');
        }
    }

    public function autoUpdate(): void
    {
        if ($this->main->siteId() || (defined('DOING_AJAX') && DOING_AJAX)) {
            return;
        }

        $this->send();
    }

    public function send(): void
    {
        $this->main->client(false)->summarizeSite(json_encode($this->summarizer->data()));
    }
}
