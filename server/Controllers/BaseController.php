<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Enums\RouteMethods;
use WpAi\AgentWp\Main;

class BaseController
{
    protected RouteMethods $method = RouteMethods::GET;

    protected string|array $permission = 'all';

    public function __construct(protected Main $main)
    {
    }

    public function method(): string
    {
        return $this->method->value;
    }

    public function check_permission(): bool
    {
        if ($this->permission === 'all') {
            return true;
        }
        if (is_array($this->permission) && is_callable($this->permission)) {
            return call_user_func($this->permission);
        }

        return current_user_can($this->permission);
    }

    public function respond(array $response): void
    {
        wp_send_json($response);
    }
}
