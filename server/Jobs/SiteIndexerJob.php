<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Services\AwpClient;

class SiteIndexerJob extends BaseJob
{
    protected $action = 'site_indexer';

    protected function handle()
    {
        $this->handleAsync(function (AwpClient $client, string $data) {
            $client->indexSite($data);
        });
    }
}
