<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Services\RevokeApiToken;
use WpAi\AgentWp\UserAuth;

class Logout extends BaseController
{
    protected string $permission = UserAuth::CAP_MANAGE_AGENTWP_CONNECTION;

    public function __invoke(): void
    {
        (new RevokeApiToken($this->main))->revoke();
        $this->main->settings->delete(['client_secret', 'token', 'verification_key']);
        $this->respond();
    }
}
