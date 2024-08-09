<?php

namespace WpAi\AgentWp\Services;

class AccountSettings
{
    private AwpClient $client;

    public function __construct(AwpClient $client)
    {
        $this->client = $client;
    }

    public function get(): array
    {
        $response = $this->client->getSiteSettings();

        if($response){
            return json_decode($response->getBody()->getContents(), true);
        }

        return [];

    }
}
