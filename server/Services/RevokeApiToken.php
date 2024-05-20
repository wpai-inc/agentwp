<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Factory\AwpClientFactory;
use WpAi\AgentWp\Main;

class RevokeApiToken
{

    public function __construct(private Main $main)
    {
    }

    public function revoke(): void
    {
        try {
            $awp_client = AwpClientFactory::create($this->main);
            $awp_client->request('POST', $this->main->apiHost() . '/api/site/disconnect');
        } catch (\Exception $e) {
            // Do nothing
            error_log($e->getMessage());
        }
    }
}
