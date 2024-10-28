<?php

namespace WpAi\AgentWp\Modules\AwpClient;

use GuzzleHttp\Client as GuzzleHttpClient;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Psr7\Response;
use WpAi\AgentWp\Main;

class Client
{
    private string $version = 'v1';

    private ApiRoutes $routes;

    private string $baseUrl = 'https://app.agentwp.com';

    private ?string $token = null;

    private ?string $siteId = null;

    private ?\WP_User $wpUser = null;

    private array $options = [];

    private array $defaultClientOptions = [
        'timeout' => 3, // 3 second timeout.
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
        if ($jsonRoutes === false) {
            throw new \Exception('Failed to read routes.json');
        }

        $this->routes = ApiRoutes::fromJson($jsonRoutes);
    }

    /**
     * Calls the API route by its defined name in ApiRoutes.
     *
     * @throws RouteDoesNotExistException|GuzzleException
     */
    public function __call(string $name, array $args): Response
    {
        $args = isset($args[0]) ? $args[0] : [];
        extract($this->getUrl($name, $args));

        return $this->getClient()->request($method, $path, [
            'json' => $params,
        ]);
    }

    /**
     * @throws RouteDoesNotExistException
     */
    public function getRoute(string $name): ApiRoute
    {
        return $this->routes->getRoute($name);
    }

    public function getUrl($name, $params = []): array
    {
        $route = $this->getRoute($name);
        $method = $route->getMethod();
        [$url, $leftOverParams] = $route->getUrl($params);

        return [
            'path' => $url,
            'url' => $this->baseUrl.'/'.$url,
            'method' => $method,
            'params' => $leftOverParams,
        ];
    }

    public function setOptions(array $options): self
    {
        $this->options = $options;

        return $this;
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
            'X-Wp-Plugin-Version' => Main::PLUGIN_VERSION,
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
        $headers = array_merge(
            $this->getDefaultHeaders(),
            $this->options['headers'] ?? []
        );

        $defaultOptions = array_merge(
            $this->defaultClientOptions,
            ['base_uri' => $this->baseUrl],
        );

        $options = array_merge($defaultOptions, $this->options);
        $options['headers'] = $headers;

        return $options;
    }

    public function getHeaders(): array
    {
        return $this->getClientOptions()['headers'];
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
