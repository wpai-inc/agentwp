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

        $ts = microtime(true);
        $summarizer = new SiteSummarizer();
        error_log('SiteSummarizer: '.(microtime(true) - $ts));
//        if ($summarizer->hasUpdated()) {
            $this->main->client(false)->summarizeSite(json_encode($summarizer->getData()));
//        }

        $ts2 = microtime(true);
        $site_data = new SiteData();
        error_log('SiteData: '.(microtime(true) - $ts2));
//        if ($site_data->hasUpdated()) {
            $this->main->client(false)->indexSite(json_encode($site_data->getData()));
//        }

        error_log('Total: '.(microtime(true) - $ts));
        $this->respond([]);
    }
}
