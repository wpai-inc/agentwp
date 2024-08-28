<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;

class RevokeApiToken
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function revoke(): void
    {
        try {
            $this->main->client()->request('POST', 'sites/disconnect');
        } catch (\Exception $e) {
            // Do nothing
            error_log($e->getMessage());
        }
    }
}
