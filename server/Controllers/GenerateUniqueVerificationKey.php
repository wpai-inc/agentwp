<?php

namespace WpAi\AgentWp\Controllers;

class GenerateUniqueVerificationKey extends BaseController
{
    protected string $permission = 'canGenerateVerificationKey';

    public function __invoke(): void
    {
        $this->verifyNonce();

        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);
        $this->respond([
            'key' => $key,
            'home_url' => home_url(),
        ]);
    }
}
