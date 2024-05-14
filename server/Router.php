<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Controllers\TestResponse;

class Router implements Registrable
{
    const REST_ROUTE_ENDPOINT = 'agentwp/v1';

    protected array $routes = [
        'test_route' => [TestResponse::class, 'test_response'],
    ];

    public function __construct(private Main $main)
    {
    }

    public function register(): void
    {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes(): void
    {
        foreach ($this->routes as $route => $callback) {
            $controller = new $callback[0]($this->main);
            register_rest_route(self::REST_ROUTE_ENDPOINT, '/'.$route, [
                'methods' => $controller->method(),
                'callback' => [$controller, $callback[1]],
                'permission_callback' => [$controller, 'check_permission'],
            ]);
        }
    }
}
