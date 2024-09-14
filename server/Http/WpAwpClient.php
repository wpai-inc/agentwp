<?php

namespace WpAi\AgentWp\Http;

use GuzzleHttp\Exception\ClientException;
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

    public function __call(string $name, array $arguments = [])
    {
        $params = isset($arguments[0]) ? $arguments[0] : [];
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

    public function setToken(?string $token): self
    {
        $this->client->setToken($token);

        return $this;
    }

    public function setWpUser(?\WP_User $user): self
    {
        $this->client->setWpUser($user);

        return $this;
    }

    public function setSiteId(?string $id): self
    {
        $this->client->setSiteId($id);

        return $this;
    }

    public function getClient(): Client
    {
        return $this->client;
    }
}
