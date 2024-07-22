<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;

class RevokeApiToken
{
    public function __construct(private Main $main) {}

    public function revoke(): void
    {
        try {
            $this->main->client()->request('POST', $this->main->apiHost().'/api/sites/disconnect');
        } catch (\Exception $e) {
            // Do nothing
            error_log($e->getMessage());
        }
    }
}
