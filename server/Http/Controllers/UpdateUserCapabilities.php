<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\UserAuth;

class UpdateUserCapabilities extends BaseController
{
    protected string $permission = UserAuth::CAP_MANAGE_AGENTWP_USERS;

    protected string $method = 'POST';

    public function __invoke(): void
    {
        $data = $this->request->getJsonContent();

        $user = new \WP_User($data['user']);

        if (isset($data['agentwp_access'])) {
            $agentwp_access = $data['agentwp_access'];
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
            ->wpuserUpdate([
                'id' => $user->ID,
                'display_name' => $user->display_name,
                'nicename' => $user->user_nicename,
                'role' => implode(',', $user->roles),
            ]);

        $this->respond();
    }
}
