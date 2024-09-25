<?php

namespace WpAi\AgentWp\Factories;

use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\AwpClient\Client;

class ClientFactory
{
    public static function make(Main $main): Client
    {
        return (new Client)
            ->setToken($main->getAccessToken())
            ->setWpUser(wp_get_current_user())
            ->setSiteId($main->siteId())
            ->setBaseUrl($main->apiHost());
    }
}
