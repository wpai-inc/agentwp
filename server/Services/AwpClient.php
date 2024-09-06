<?php

namespace WpAi\AgentWp\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Psr\Http\Message\ResponseInterface;
use WpAi\AgentWp\Traits\ClientRequests;

class AwpClient
{
    use ClientRequests;

    private ?string $token = null;

    private int $timeout = 15;

    private string $agentWpVersion = '0.1-alpha1';

    private ?\WP_User $wp_user;

    private ?string $siteId;

    private ?string $apiHost;

    private $disconnectCallback;

    public function __construct()
    {
        $this->wp_user = wp_get_current_user();
    }

    public function requestRaw(string $method, string $url, array $additionalHeaders = [], $body = null): ResponseInterface
    {
        $client = $this->buildClient();

        $defaultHeaders = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-Wp-Agent-Version' => $this->agentWpVersion,
            'X-Wp-User-Id' => $this->wp_user->ID,
            'X-Wp-Site-Id' => $this->siteId,
        ];
        $authHeader = $this->token ? [
            'Authorization' => "Bearer $this->token",
        ] : [];
        $headers = array_merge(
            $defaultHeaders,
            $authHeader,
            $additionalHeaders,
        );

        $request = new Request($method, $this->getBaseUri().ltrim($url, '/'), $headers, $body);

        return $client->send($request);

    }

    public function request(string $method, string $url, array $additionalHeaders = [], $body = null)
    {
        try {
            $response = $this->requestRaw($method, $url, $additionalHeaders, $body);
            if ($response->getStatusCode() > 200) {
                // Disconnect the site
                if ($this->disconnectCallback) {
                    call_user_func($this->disconnectCallback);
                }
            }
            return $response;
        } catch (\Exception $e) {
            error_log($e->getMessage());
            return null;
        }
    }

    public function isAuthorized(): bool
    {
        return ! is_null($this->token);
    }

    public function json(string $method, string $url, $body = null): ?array
    {
        try {
            $res = $this->requestRaw($method, $url, [], $body);

            return json_decode($res->getBody()->getContents(), true);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function setTimeout(int $timeout): self
    {
        $this->timeout = $timeout;

        return $this;
    }

    public function setWpUser($wp_user): self
    {
        $this->wp_user = $wp_user;

        return $this;
    }

    public function setSiteId(?string $siteId): self
    {
        $this->siteId = $siteId;

        return $this;
    }

    public function setApiHost(?string $apiHost): self
    {
        $this->apiHost = $apiHost;

        return $this;
    }

    private function buildClient(): Client
    {
        return new Client([
            'timeout' => $this->timeout,
            'base_uri' => $this->apiHost.$this->getBaseUri(),
        ]);
    }

    private function getBaseUri(): string
    {
        return '/api/';
    }

    public function setDisconnectCallback(callable $callback): self
    {
        $this->disconnectCallback = $callback;
        return $this;
    }
}
