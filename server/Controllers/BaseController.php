<?php

namespace WpAi\AgentWp\Controllers;

use Symfony\Component\HttpFoundation\Request;
use WpAi\AgentWp\Main;

class BaseController
{
    protected string $method = 'GET';

    protected array $middleware = [];

    /**
     * Always use a nonce unless there's a good reason
     * not too. Dangerous option. Use with caution.
     */
    protected bool $dangerNoNonce = false;

    protected string $permission = 'all';

    protected Request $request;

    protected Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->request = Request::createFromGlobals();
    }

    public function method(): string
    {
        return $this->method;
    }

    public function check_permission(): bool
    {
        if (! $this->dangerNoNonce) {
            $this->verifyNonce();
        }

        foreach ($this->middleware as $middleware) {
            if (method_exists($this, $middleware)) {
                $this->$middleware();
            }
        }

        if ($this->permission === 'all') {
            return true;
        }

        if ($this->permission === 'canGenerateVerificationKey') {
            return call_user_func([$this->main->auth, 'canGenerateVerificationKey']);
        }
        if ($this->permission === 'hasValidVerificationKey') {
            return call_user_func([$this->main->auth, 'hasValidVerificationKey']);
        }
        if ($this->permission === 'CanLogout') {
            return call_user_func([$this->main->auth, 'CanLogout']);
        }

        if (is_array($this->permission) && is_callable($this->permission)) {
            return call_user_func($this->permission);
        }

        return current_user_can($this->permission);
    }

    protected function respond($response = null): void
    {
        wp_send_json_success($response);
    }

    protected function error($response, $status_code = null): void
    {
        $this->respond($response, $status_code);
    }

    protected function respondWithError(string $message, int $status_code): void
    {
        wp_send_json_error($message, $status_code);
    }

    protected function verifyNonce(): void
    {
        if (! wp_verify_nonce($_GET['nonce'], $this->main::SLUG)) {
            $this->error('Invalid nonce', 403);
        }
    }

    protected function getContent(): array
    {
        $data = json_decode($this->request->getContent(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Invalid JSON data', 400);
        }

        return $data;
    }

    protected function check_site_connection(): void
    {
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }
    }
}
