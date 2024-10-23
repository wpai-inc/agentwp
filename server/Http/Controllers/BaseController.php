<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Http\HttpRequest;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\HasHttpErrors;

class BaseController
{
    use HasHttpErrors;

    protected string $method = 'GET';

    public array $middleware = [];

    protected string $permission = 'all';

    protected HttpRequest $request;

    protected Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->request = new HttpRequest;
    }

    public function method(): string
    {
        return $this->method;
    }

    public function check_permission()
    {
        /**
         * @todo: verify nonce for all requests (including GET)
         */
        // $nonce = $this->request->getHeader('X-WP-Nonce') ?: $this->request->get('nonce');

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

    protected function respondWithError(string $message, int $status_code): void
    {
        wp_send_json_error($message, $status_code);
    }

    protected function getContent($key = null)
    {
        $data = $this->request->getJsonContent();
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Invalid JSON data', 400);
        }

        if ($key && isset($data[$key])) {
            return $data[$key];
        }

        return $data;
    }
}
