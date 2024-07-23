<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Services\AwpClient;

class SiteSummarizerJob extends \WP_Async_Request
{
    protected $prefix = 'agentwp';

    protected $action = 'site_summarizer';

    protected function handle()
    {
        $awpClient = new AwpClient();
        $awpClient->setToken($_POST['access_token']);
        $awpClient->summarizeSite($_POST['data']);
    }
}
