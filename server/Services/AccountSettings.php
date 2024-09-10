<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\SiteSettings;

class AccountSettings
{
    use SiteSettings;

    private AwpClient $client;
    private Main $main;

    public function __construct(AwpClient $client, Main $main)
    {
        $this->client = $client;
        $this->main = $main;
    }

    public function get(): array
    {
        $transient = new Transient($this->main);
        $cache = $transient->get('account_settings');

        if ($cache) {
            return $cache;
        }

        $response = $this->client->getSiteSettings();

        if ($response) {
            $settings = json_decode($response['body'], true);
            $transient->set('account_settings', $this->parseSettings($settings), 12 * HOUR_IN_SECONDS);

            return $settings;
        }

        return [];

    }
}
