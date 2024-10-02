<?php

namespace WpAi\AgentWp\Http\Controllers;

class ValidateWebsite extends BaseController
{
    protected string $permission = 'hasValidVerificationKey';

    public function __invoke(): void
    {
        if (! isset($_GET['verification_key'])) {
            $this->error('verification_key_missing');
        }

        $key = sanitize_text_field(wp_unslash($_GET['verification_key']));
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
