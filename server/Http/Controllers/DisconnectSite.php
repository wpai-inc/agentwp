<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\UserAuth;

class DisconnectSite extends BaseController
{
    protected string $permission = UserAuth::CAP_MANAGE_AGENTWP_CONNECTION;

    public function __invoke(): void
    {
        $this->main->settings->disconnectSite($this->main);
        $this->respond();
    }
}
