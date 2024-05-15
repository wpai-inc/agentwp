<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\UserAuth;

class MakeOnboardingAsCompleted extends BaseController
{

    protected string|array $permission = UserAuth::CAP_MANAGE_AGENTWP_USERS;
    public function onboarding_completed(): void
    {
        $this->verifyNonce();
        $this->main->settings->set('onboarding_completed', true);
        $this->respond();
    }
}

