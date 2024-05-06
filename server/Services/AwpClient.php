<?php

namespace WpAi\AgentWp\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Psr\Http\Message\ResponseInterface;
use WpAi\AgentWp\Helper;

class AwpClient
{
    private string $baseUrl;

    private string $agentWpVersion = '0.1-alpha1';

    public function __construct(private string $token)
    {
        $this->baseUrl = Helper::config('AGENT_WP_SERVER_BASE_URL');
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
        $headers = array_merge(
            [
                'Authorization' => "Bearer $this->token",
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'X-WP-AGENT-VERSION' => $this->agentWpVersion,
            ],
            $additionalHeaders,
        );
        $request = new Request($method, $url, $headers, $body);

        return $client->send($request);
    }

    public function setToken(string $token)
    {
        $this->token = $token;
    }

    private function buildClient(): Client
    {
        return new Client([
            'timeout' => 15,
        ]);
    }
}
