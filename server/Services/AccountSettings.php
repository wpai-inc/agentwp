<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Http\WpAwpClient;

class AccountSettings
{
    private WpAwpClient $client;

    private int $site_settings_expiration = 60;

    public function __construct(WpAwpClient $client)
    {
        $this->client = $client;
    }

    public function get()
    {
        if (false !== ($res = get_transient('site_settings'))) {
            return $res;
        }
        $res = $this->client->siteSettingAll();
        set_transient('site_settings', $res, $this->site_settings_expiration);

        return is_array($res) ? $res : [];
    }
}
