<?php

namespace WpAi\AgentWp\Http\Controllers;

class GenerateUniqueVerificationKey extends BaseController
{
    protected string $permission = 'canGenerateVerificationKey';

    public function __invoke(): void
    {
        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);
        $this->respond([
            'key' => $key,
            'home_url' => home_url(),
        ]);
    }
}
