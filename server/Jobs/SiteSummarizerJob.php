<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Services\AwpClient;

class SiteSummarizerJob extends BaseJob
{
    protected $action = 'site_summarizer';

    protected function handle()
    {
        $this->handleAsync(function (AwpClient $client, string $data) {
            $client->summarizeSite($data);
        });
    }
}
