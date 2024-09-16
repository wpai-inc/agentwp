<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Http\WpAwpClient;

class AccountSettings
{
    private WpAwpClient $client;

    public function __construct(WpAwpClient $client)
    {
        $this->client = $client;
    }

    public function get(): array
    {
        return $this->client->siteSettingAll();
    }
}
