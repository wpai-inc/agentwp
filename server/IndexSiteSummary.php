<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Jobs\SiteSummarizerJob;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;

class IndexSiteSummary implements Registrable
{
    private SiteSummarizerJob $job;

    public function __construct(private Main $main)
    {
        $this->job = new SiteSummarizerJob();
    }

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
                $data = [
                    'access_token' => $this->main->settings->getAccessToken(),
                    'data' => json_encode($summarizer->data())
                ];

                $this->job->data($data)->dispatch();
            }
        }
    }

    private function getDataForSummarization(): array
    {
        return ['some sample data'];
    }
}
