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

        if($this->permission === 'canGenerateVerificationKey') {
            return call_user_func([$this->main->auth, 'canGenerateVerificationKey']);
        }
        if($this->permission === 'hasValidVerificationKey') {
            return call_user_func([$this->main->auth, 'hasValidVerificationKey']);
        }

        if (is_array($this->permission) && is_callable($this->permission)) {
            return call_user_func($this->permission);
        }

        return current_user_can($this->permission);
    }

    protected function respond(array|string|null $response = null): void
    {
        wp_send_json_success($response);
    }

    protected function error(mixed $response, $status_code=null): void
    {
        $this->respond($response, $status_code);
    }

    protected function verifyNonce(): void
    {
        if ( ! wp_verify_nonce($_GET['nonce'], $this->main::SLUG)) {
            $this->error('Invalid nonce', 403);
        }
    }
}
