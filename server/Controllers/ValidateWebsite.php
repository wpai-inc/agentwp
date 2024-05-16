<?php

namespace WpAi\AgentWp\Controllers;

class ValidateWebsite extends BaseController
{

    protected string|array $permission = 'hasValidVerificationKey';

    public function validate_website(): void
    {
        $key = sanitize_text_field($_REQUEST['verification_key']);
        if (
            $this->main->settings->verification_key
            && ! empty($key)
            && $key === $this->main->settings->verification_key
        ) {
            $this->respond([
                'status' => 'success',
            ]);
        } else {
            $this->error([
                'status' => 'failed',
            ]);
        }
    }
}
