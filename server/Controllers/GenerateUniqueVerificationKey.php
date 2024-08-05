<?php

namespace WpAi\AgentWp\Controllers;

class GenerateUniqueVerificationKey extends BaseController
{

    protected string $permission = 'canGenerateVerificationKey';
    public function generate_unique_verification_key(): void
    {
        $this->verifyNonce();

        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);
        $this->respond([
            'key'      => $key,
            'home_url' => home_url(),
        ]);
    }
}
