<?php

namespace WpAi\AgentWp\Controllers;

class TestAuthResponse extends BaseController
{
    protected bool $dangerNoNonce = true;

    protected array $middleware = [
        'check_site_connection',
    ];

    public function __invoke(): void
    {
        $this->respond([
            'only_authorized_users' => home_url(),
        ]);
    }
}
