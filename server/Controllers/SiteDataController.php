<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\Cache;
use WpAi\AgentWp\SiteData;

class SiteDataController extends BaseController
{
    protected string $permission = 'canGenerateVerificationKey';

    protected string $method = 'GET';

    protected array $middleware = [
        'check_site_connection',
    ];

    public function __invoke()
    {
        $cache = new Cache('site_data', SiteData::getDebugData());

        if (! $cache->hit()) {
            $this->respond($cache->getData());
        }

        $this->respond([]);
    }
}
