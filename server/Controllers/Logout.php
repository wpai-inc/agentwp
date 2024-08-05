<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\RevokeApiToken;
use WpAi\AgentWp\UserAuth;

class Logout extends BaseController
{

    protected string $permission = UserAuth::CAP_MANAGE_AGENTWP_CONNECTION;

    public function logout(): void
    {
        $this->verifyNonce();

         (new RevokeApiToken($this->main))->revoke();
        $this->main->settings->delete(['client_secret', 'token', 'verification_key']);
        $this->respond();
    }
}
