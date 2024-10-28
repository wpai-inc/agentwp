<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\UserAuth;

class SaveConnection extends BaseController
{
    protected string $permission = 'hasValidVerificationKey';

    protected string $method = 'POST';

    public bool $disable_nonce = true;

    public function __invoke(): void
    {
        if (! $this->request->get('verification_key')) {
            $this->error('verification_key_missing');
        }

        $key = $this->request->get('verification_key', true);
        if (
            ! $this->main->settings->verification_key
            || empty($key)
               && $key !== $this->main->settings->verification_key
        ) {
            $this->error('failed_site_verification');
        }

        $this->main->settings->delete('verification_key');

        $data = $this->getContent();

        $this->main->settings->set([
            'site_id' => sanitize_text_field($data['site_id']),
            'client_id' => sanitize_text_field($data['client_id']),
            'client_secret' => sanitize_text_field($data['client_secret']),
        ]);

        // Make the current user an AWP users manager
        $user_email = sanitize_text_field($data['user_email']);
        $user = get_user_by('email', $user_email);

        $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);
        $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_USERS);
        $user->add_cap(UserAuth::CAP_AGENTWP_ACCESS);

        $this->respond([
            'status' => 'success',
        ]);
    }
}
