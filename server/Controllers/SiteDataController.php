<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Modules\SiteData\SiteData;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;

class SiteDataController extends BaseController
{
    protected string $permission = 'canGenerateVerificationKey';

    protected string $method = 'GET';

    public function maybe_send_site_data()
    {
        $this->verifyNonce();
        if ( ! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $summarizer = new SiteSummarizer();
        if ($summarizer->hasUpdated()) {
            $this->main->client(false)->summarizeSite(json_encode($summarizer->getData()));
        }

        $site_data = new SiteData();
        if ($site_data->hasUpdated()) {
            $this->main->client(false)->indexSite(json_encode($site_data->getData()));
        }
        $this->respond([]);
    }
}
