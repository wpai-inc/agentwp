<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\RefreshApiToken;
use WpAi\AgentWp\UserAuth;

class RefreshToken extends BaseController
{
    protected string $permission = UserAuth::CAP_AGENTWP_ACCESS;

    public function __invoke(): void
    {
        $new_api_token = (new RefreshApiToken($this->main))->refresh();

        $this->respond(['api_token' => $new_api_token]);
    }
}
