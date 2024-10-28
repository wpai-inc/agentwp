<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Services\Cache;
use WpAi\AgentWp\SiteData;

/**
 * @since 1.1.2
 */
class SiteDataController extends BaseController
{
    protected string $method = 'GET';

    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
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
