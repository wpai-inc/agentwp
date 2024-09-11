<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\UserAuth;

class UpdateUserCapabilities extends BaseController
{
    protected string $permission = UserAuth::CAP_MANAGE_AGENTWP_USERS;

    protected string $method = 'POST';

    public function __invoke(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $user_id = sanitize_text_field($data['user']);
        $user = new \WP_User($user_id);
        if (isset($data['agentwp_access'])) {
            $agentwp_access = sanitize_text_field($data['agentwp_access']);
            if ($agentwp_access) {
                $user->add_cap(UserAuth::CAP_AGENTWP_ACCESS);
            } else {
                $user->remove_cap(UserAuth::CAP_AGENTWP_ACCESS);
            }
        } elseif (isset($data['manage_agentwp_users'])) {
            $manage_agentwp_users = sanitize_text_field($data['manage_agentwp_users']);
            if ($manage_agentwp_users) {
                $user->add_cap(UserAuth::CAP_MANAGE_AGENTWP_USERS);
            } else {
                $user->remove_cap(UserAuth::CAP_MANAGE_AGENTWP_USERS);
            }
        }

        $this->main->client()
            ->setWpUser($user)
            ->updateUser($user->ID);

        $this->respond();
    }
}
