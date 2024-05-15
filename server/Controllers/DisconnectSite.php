<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\RevokeApiToken;
use WpAi\AgentWp\UserAuth;

class DisconnectSite extends BaseController
{
    protected string|array $permission = UserAuth::CAP_MANAGE_AGENTWP_CONNECTION;
    public function disconnect_site(): void
    {
        $this->verifyNonce();

        (new RevokeApiToken($this->main))->revoke();
        $this->main->settings->delete(['site_id', 'client_id', 'client_secret', 'token', 'verification_key']);
        $this->respond();
    }

}
