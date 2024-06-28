<?php

namespace WpAi\AgentWp\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Psr\Http\Message\ResponseInterface;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\ClientRequests;

class AwpClient
{
    use ClientRequests;

    private ?string $token = null;

    private int $timeout = 15;

    private string $agentWpVersion = '0.1-alpha1';
    private ?\WP_User $wp_user;

    public function __construct(private Main $main, private $checkUserAccessRights = true)
    {
        if ( ! $checkUserAccessRights && $access_token = $this->main->settings->getAccessToken()) {
            $this->setToken($access_token);
        } elseif ($access_token = $this->main->auth()->getAccessToken()) {
            $this->setToken($access_token);
        }

        $this->wp_user = wp_get_current_user();
    }

    public function request(string $method, string $url, array $additionalHeaders = [], $body = null): ResponseInterface
    {
        $client         = $this->buildClient();
        $defaultHeaders = [
            'Accept'             => 'application/json',
            'Content-Type'       => 'application/json',
            'X-Wp-Agent-Version' => $this->agentWpVersion,
            'X-Wp-User-Id'       => $this->wp_user->ID,
            'X-Wp-Site-Id'       => $this->main->siteId(),
        ];
        $authHeader     = $this->token ? [
            'Authorization' => "Bearer $this->token",
        ] : [];
        $headers        = array_merge(
            $defaultHeaders,
            $authHeader,
            $additionalHeaders,
        );
        $request        = new Request($method, $url, $headers, $body);

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

    public function setWpUser($wp_user): self
    {
        $this->wp_user = $wp_user;

        return $this;
    }

}
