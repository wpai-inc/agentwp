<?php

namespace WpAi\AgentWp\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Psr\Http\Message\ResponseInterface;

class AwpClient
{
    private ?string $token = null;

    private int $timeout = 15;

    private string $agentWpVersion = '0.1-alpha1';

    public function __construct(private string $baseUrl)
    {
    }

    public function indexSite($siteId, $data)
    {
        try {
            return $this->request(
                method: 'POST',
                url: "$this->baseUrl/api/sites/$siteId/index/health",
                body: $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function indexError($siteId, $data)
    {
        try {
            return $this->request(
                method: 'POST',
                url: "$this->baseUrl/api/sites/$siteId/index/errors",
                body: $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function request(string $method, string $url, array $additionalHeaders = [], $body = null): ResponseInterface
    {
        $client = $this->buildClient();
        $defaultHeaders = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-WP-AGENT-VERSION' => $this->agentWpVersion,
        ];
        $authHeader = $this->token ? [
            'Authorization' => "Bearer $this->token",
        ] : [];
        $headers = array_merge(
            $defaultHeaders,
            $authHeader,
            $additionalHeaders,
        );
        $request = new Request($method, $url, $headers, $body);

        return $client->send($request);
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

    private function buildClient(): Client
    {
        return new Client([
            'timeout' => $this->timeout,
        ]);
    }
}
