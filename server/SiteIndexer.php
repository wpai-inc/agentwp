<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Factory\AwpClientFactory;

class SiteIndexer implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        add_action('init', [$this, 'indexSite']);
    }

    /**
     * Temporary for demo, terrible performance.
     * Needs to run intermittently and check for hash changes before sending
     * Explore: transients or cron jobs
     */
    public function indexSite()
    {
        if ($siteId = $this->main->siteId()) {
            $debug_data = SiteData::getDebugData();
            $awpClient = AwpClientFactory::create($this->main);

            $response = $awpClient->indexSite($siteId, json_encode($debug_data));
        }
    }
}
