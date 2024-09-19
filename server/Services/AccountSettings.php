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

    /**
     * @return array|\WP_Error
     */
    public function get()
    {
        $res = $this->client->siteSettingAll();

        return is_array($res) ? $res : [];
    }
}
