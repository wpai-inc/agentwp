<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\RefreshApiToken;
use WpAi\AgentWp\UserAuth;


class RefreshToken extends BaseController
{

    protected string|array $permission = UserAuth::CAP_AGENTWP_ACCESS;

    public function refresh(): void
    {
        $this->verifyNonce();

        $new_api_token = (new RefreshApiToken($this->main))->refresh();

        $this->respond(['api_token' => $new_api_token]);
    }
}
