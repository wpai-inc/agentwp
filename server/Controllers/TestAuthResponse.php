<?php

namespace WpAi\AgentWp\Controllers;

class TestAuthResponse extends BaseController
{
    // protected bool $dangerNoNonce = true;

    public function __invoke(): void
    {
        $this->respond([
            'only_authorized_users' => home_url(),
        ]);
    }
}
