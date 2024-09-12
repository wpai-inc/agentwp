<?php

namespace WpAi\AgentWp\Http;

use WpAi\AgentWp\Modules\AwpClient\Client;

/**
 * Wrapper around the AwpClient that integrates
 * it into the WordPress environment.
 */
class WpAwpClient
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function __call(string $name, array $arguments)
    {
        try {
            $response = $this->client->$name(...$arguments);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            return new \WP_Error($e->getMessage());
        }
    }

    public function getClient(): Client
    {
        return $this->client;
    }
}
