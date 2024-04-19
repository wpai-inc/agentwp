<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class SiteIndexer implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        add_action('shutdown', [$this, 'indexSite']);
    }

    /**
     * Temporary for demo, terrible performance.
     * Needs to run intermittently and check for hash changes before sending
     * Explore: transients or cron jobs
     */
    public function indexSite()
    {
        $debug_data = SiteData::getDebugData();
        $response = wp_remote_post("http://laravel.test/api/sites/{$this->main->siteId}/index/health", [
            'body' => json_encode($debug_data),
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);
    }
}
