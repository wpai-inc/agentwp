<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Traits\SiteSettings;

class AccountSettings
{
    use SiteSettings;

    private AwpClient $client;

    public function __construct(AwpClient $client)
    {
        $this->client = $client;
    }

    public function get(): array
    {

        $cache = Transient::get('account_settings');

        if ($cache) {
            return $cache;
        }

        $response = $this->client->getSiteSettings();

        if ($response) {
            $settings = json_decode($response['body'], true);
            Transient::set('account_settings', $this->parseSettings($settings), 12 * HOUR_IN_SECONDS);

            return $settings;
        }

        return [];

    }
}
