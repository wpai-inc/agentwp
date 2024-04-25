<?php

namespace WpAi\AgentWp\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Psr\Http\Message\ResponseInterface;

class AwpClient
{
    private string $agentWpVersion = '0.1-alpha1';
    private string $userAgent;

    public function __construct(private string $token) {
        $this->userAgent = "agent-wp-client-$this->agentWpVersion";
    }

    public function request(string $method, string $url, array $additionalHeaders = [], $body = null): ResponseInterface
    {
        $client = $this->buildClient();
        $headers = array_merge(
            [
                'Authorization' => "Bearer $this->token",
                'Accept' => 'application/json',
                'User-Agent' => $this->userAgent
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
