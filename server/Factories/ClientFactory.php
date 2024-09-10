<?php

namespace WpAi\AgentWp\Factories;

use WpAi\AgentWp\Main;
use WpAi\AgentWp\Services\AwpClient;

class ClientFactory
{
    public static function make(Main $main, bool $checkUserAccessRights = true): AwpClient
    {
        $client = new AwpClient();
        if (! $checkUserAccessRights && $access_token = $main->settings->getAccessToken()) {
            $client->setToken($access_token);
        } elseif ($access_token = $main->auth()->getAccessToken()) {
            $client->setToken($access_token);
        }

        $client->setWpUser(wp_get_current_user())
            ->setSiteId($main->siteId())
            ->setApiHost($main->apiHost())
            ->setDisconnectCallback(function () use ($main) {
                $main->settings->cleanupConnectionDetails();
            });

        return $client;
    }
}
