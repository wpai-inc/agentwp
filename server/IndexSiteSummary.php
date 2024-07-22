<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Services\AwpClient;

class IndexSiteSummary extends \WP_Async_Request implements Registrable
{
    protected $prefix = 'agentwp';

    protected $action = 'site_summarizer';

    public function __construct(private Main $main)
    {
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
                $this->data(['data' => json_encode($summarizer->data())])->dispatch();
            }
        }
    }

    private function getDataForSummarization(): array
    {
        return ['some sample data'];
    }

    /**
     * Handle a dispatched request.
     */
    protected function handle()
    {
        (new AwpClient($this->main, false))->summarizeSite($_POST['data']);
    }
}
