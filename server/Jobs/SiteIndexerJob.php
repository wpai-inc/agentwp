<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Services\AwpClient;

class SiteIndexerJob extends \WP_Async_Request
{
    protected $prefix = 'agentwp';

    protected $action = 'site_indexer';

    protected function handle()
    {
        error_log( "test" );
        $awpClient = new AwpClient();
        $awpClient->setToken($_POST['access_token']);
        $awpClient->indexSite($_POST['data']);
    }
}
