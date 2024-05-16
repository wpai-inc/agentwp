<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Enums\RouteMethods;
use WpAi\AgentWp\UserAuth;

class SaveConnection extends BaseController
{

    protected string|array $permission = 'hasValidVerificationKey';
    protected RouteMethods $method = RouteMethods::POST;

    public function save_connection(): void
    {

        $key = sanitize_text_field($_REQUEST['verification_key'] ?? '');
        if (
            ! $this->main->settings->verification_key
            || empty($key)
               && $key !== $this->main->settings->verification_key
        ) {
            $this->error([
                'status' => 'failed',
            ]);
        }

        $this->main->settings->delete('verification_key');

        $data = json_decode(file_get_contents('php://input'), true);

        $this->main->settings->set([
            'site_id'       => sanitize_text_field($data['site_id']),
            'client_id'     => sanitize_text_field($data['client_id']),
            'client_secret' => sanitize_text_field($data['client_secret']),
        ]);


        // Make the current user an AWP users manager
        $user_email = sanitize_text_field($data['user_email']);
        $user       = get_user_by('email', $user_email);

        $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION);
        $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_USERS);
        $user->add_cap(UserAuth::CAP_AGENTWP_ACCESS);

        $this->respond([
            'status' => 'success',
        ]);
    }
}
