<?php

namespace WpAi\AgentWp\Controllers;

use Symfony\Component\HttpFoundation\Request;
use WpAi\AgentWp\Enums\RouteMethods;
use WpAi\AgentWp\Main;

class BaseController
{
    protected RouteMethods $method = RouteMethods::GET;

    protected string|array $permission = 'all';

    protected Request $request;

    public function __construct(protected Main $main)
    {
        $this->request = Request::createFromGlobals();
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

    protected function respond(mixed $response): void
    {
        wp_send_json($response);
    }

    protected function error(mixed $response): void
    {
        wp_send_json_error($response);
    }
}
