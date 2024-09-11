<?php

namespace WpAi\AgentWp\Services;

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

    public function requestRaw(string $method, string $url, array $additionalHeaders = [], $body = null)
    {
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

        $response = wp_remote_request($this->apiHost . $this->getBaseUri() . ltrim($url, '/'), [
            'method' => $method,
            'headers' => $headers,
            'body' => $body,
        ]);

        return $response;
    }

    public function request(string $method, string $url, array $additionalHeaders = [], $body = null): ?array
    {
        try {
            $response = $this->requestRaw($method, $url, $additionalHeaders, $body);

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

    public function json(string $method, string $url, array $headers = [], array $body = null): ?array
    {
        try {
            $res = $this->requestRaw($method, $url, [], $body);

            return json_decode($res['body'], true);
        } catch (\Exception $e) {
            error_log($e->getMessage());

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

    private function getBaseUri(): string
    {
        return '/api/';
    }
}
