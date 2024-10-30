<?php

namespace WpAi\AgentWp\Http\Controllers;

class ValidateWebsite extends BaseController
{
    protected string $permission = 'hasValidVerificationKey';

    public bool $disable_nonce = true;

    public function __invoke(): void
    {
        if (! $this->request->get('verification_key')) {
            $this->error('verification_key_missing');
        }

        $key = $this->request->get('verification_key', true);
        if (
            $this->main->settings->verification_key
            && ! empty($key)
            && $key === $this->main->settings->verification_key
        ) {
            $this->respond(['status' => 'success']);
        } else {
            $this->error('failed_site_verification');
        }
    }
}
