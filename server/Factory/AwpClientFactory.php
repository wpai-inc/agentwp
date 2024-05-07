<?php

namespace WpAi\AgentWp\Factory;

use WpAi\AgentWp\Main;
use WpAi\AgentWp\Services\AwpClient;

class AwpClientFactory
{
    public static function create(Main $main): AwpClient
    {
        $client = new AwpClient($main->apiHost());
        if ($t = $main->auth()->getAccessToken()) {
            $client->setToken($t);
        }

        return $client;
    }
}
