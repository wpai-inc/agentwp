<?php

namespace WpAi\AgentWp\Http;

use GuzzleHttp\Exception\ClientException;
use WpAi\AgentWp\Modules\AwpClient\Client;
use WpAi\AgentWp\Modules\AwpClient\RouteDoesNotExistException;

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
        $params = $arguments[0];
        try {
            $response = $this->client->$name($params);
            return json_decode($response->getBody()->getContents(), true);
        } catch (ClientException $e) {
            $error = json_decode($e->getResponse()->getBody()->getContents());
            return new \WP_Error(
                $e->getCode(),
                $error->message
            );
        } catch (\Exception $e) {
            return new \WP_Error(
                'api_request_error',
                $e->getMessage()
            );
        }
    }

    public function getClient(): Client
    {
        return $this->client;
    }
}
