<?php

namespace WpAi\AgentWp\Http\Middleware;

use WP_REST_Request;

class CheckSiteConnection extends Middleware
{
    public function handle(WP_REST_Request $request)
    {
        if (! $this->main->siteId()) {
            return $this->error('site_not_connected');
        }

        return true;
    }
}
