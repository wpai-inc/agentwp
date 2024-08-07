<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Contracts\IndexableData;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\SiteData\SiteData;

class SiteIndexer extends Job implements Registrable, IndexableData
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register()
    {
        parent::register();
    }

    public function send()
    {
        if ((defined('DOING_AJAX') && DOING_AJAX) || ! $this->main->siteId()) {
            return;
        }

        $site_data = new SiteData();

        if ( ! $site_data->hasUpdated()) {
            return;
        }

        $this->main->client(false)->indexSite(json_encode($site_data->getData()));


    }

    public function eventName(): string
    {
        return 'agentwp_send_site_index';
    }
}
