<?php

namespace WpAi\AgentWp\Services;

class AwpRestRoute
{

    private string $route;
    private $callback;
    private string|array $permission;

    private string $method = 'GET';

    public function __construct(string $route, callable $callback, string|array $permission = 'all')
    {;
        $this->route = $route;
        $this->callback = $callback;
        $this->permission = $permission;
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function method($method): void
    {
        $this->method = $method;
    }

    public function register_routes(): void
    {
        register_rest_route('agentwp/v1', '/' . $this->route, array(
            'methods' => $this->method,
            'callback' => $this->callback,
            'permission_callback' => array($this, 'check_permission')
        ));
    }

    public function check_permission(): bool
    {
        if ($this->permission === 'all') {
            return true;
        }
        if(is_array($this->permission) && is_callable($this->permission)) {
            return call_user_func($this->permission);
        }

        return current_user_can($this->permission);
    }
}
