<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\RevokeApiToken;
use WpAi\AgentWp\UserAuth;

class DisconnectSite extends BaseController
{
    protected string $permission = UserAuth::CAP_MANAGE_AGENTWP_CONNECTION;
    public function disconnect_site(): void
    {
        $this->verifyNonce();
        $this->main->settings->disconnectSite($this->main);
        $this->respond();
    }

}
