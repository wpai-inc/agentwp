<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\Cache;
use WpAi\AgentWp\SiteData;

class SiteDataController extends BaseController
{
    protected string $permission = 'canGenerateVerificationKey';

    protected string $method = 'GET';

    public function __invoke()
    {
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $cache = new Cache('site_data', SiteData::getDebugData());

        if (! $cache->hit()) {
            $this->respond($cache->getData());
        }

        $this->respond([]);
    }
}
