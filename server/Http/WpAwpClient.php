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

    private HttpErrors $errors;

    public function __construct(Client $client)
    {
        $this->client = $client;
        $this->errors = new HttpErrors;
    }

    /**
     * Calls the API route by its defined name in ApiRoutes.
     *
     * @return ClientResponse|\WP_Error
     */
    public function __call(string $name, array $arguments = [])
    {
        $params = isset($arguments[0]) ? $arguments[0] : [];
        $response = $this->client->$name($params);

        try {
            if ($response->isError()) {
                $res = $response->get();

                $errors = isset($res['errors']) ? $res['errors'] : [];

                return $response->setErrorResponse(new \WP_Error(
                    $response->status(),
                    $res['message'],
                    ['status' => $response->status(), 'errors' => $errors]
                ));
            }

            return $response;
        } catch (\Exception $e) {
            error_log($e->getMessage());

            return $this->errors->get('api_request_error')->toWpError();
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
