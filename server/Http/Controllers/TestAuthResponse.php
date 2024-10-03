<?php

namespace WpAi\AgentWp\Http\Controllers;

class TestAuthResponse extends BaseController
{
    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
    ];

    public function __invoke()
    {
        $this->respond([
            'only_authorized_users' => home_url(),
            'params' => $this->request->all(),
        ]);
    }
}
