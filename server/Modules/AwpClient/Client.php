<?php

namespace WpAi\AgentWp\Modules\AwpClient;

use GuzzleHttp\Client as GuzzleHttpClient;
use GuzzleHttp\Psr7\Response;

class Client
{
    private string $version = 'v1';

    private ApiRoutes $routes;

    private string $baseUrl = 'https://app.agentwp.com';

    private ?string $token = null;

    private ?string $siteId = null;

    private ?\WP_User $wpUser = null;

    private array $defaultClientOptions = [
        'timeout' => 15,
    ];

    public function __construct(
        $siteId = null,
        $token = null,
        $wpUser = null
    ) {
        $this->siteId = $siteId;
        $this->token = $token;
        $this->wpUser = $wpUser;
        $jsonRoutes = file_get_contents(__DIR__.'/routes.json');
        $this->routes = ApiRoutes::fromJson($jsonRoutes);
    }

    /**
     * Calls the API route by its defined name in ApiRoutes.
     */
    public function __call(string $name, array $args): Response
    {
        $params = isset($args[0]) ? $args[0] : [];
        $route = $this->routes->getRoute($name);
        $method = $route->getMethod();
        $url = $route->getUrl(is_array($params) ? $params : []);

        return $this->getClient()->request($method, $url, [
            'json' => $params,
        ]);
    }

    public function setToken(?string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function setWpUser(?\WP_User $user): self
    {
        $this->wpUser = $user;

        return $this;
    }

    public function setSiteId(?string $id): self
    {
        $this->siteId = $id;

        return $this;
    }

    public function setBaseUrl(string $url): self
    {
        $this->baseUrl = $url;

        return $this;
    }

    private function getAuthHeader(): array
    {
        if (! $this->token) {
            return [];
        }

        return [
            'Authorization' => "Bearer $this->token",
        ];
    }

    private function getDefaultHeaders(): array
    {
        $defaults = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-Wp-Agent-Version' => $this->version,
        ];

        if ($this->wpUser) {
            $defaults['X-Wp-User-Id'] = $this->wpUser->ID;
        }

        if ($this->siteId) {
            $defaults['X-Wp-Site-Id'] = $this->siteId;
        }

        return array_merge($defaults, $this->getAuthHeader());
    }

    private function getClientOptions(): array
    {
        return array_merge(
            $this->defaultClientOptions,
            [
                'base_uri' => $this->baseUrl,
                'headers' => $this->getDefaultHeaders(),
            ],
        );
    }

    public function getClient(): GuzzleHttpClient
    {
        return new GuzzleHttpClient($this->getClientOptions());
    }

    public function getRoutes(): ApiRoutes
    {
        return $this->routes;
    }

    public function setVersion(string $v): self
    {
        $this->version = $v;

        return $this;
    }
}