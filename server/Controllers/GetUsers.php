<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\UserAuth;

class GetUsers extends BaseController
{

    protected string $permission = 'canGenerateVerificationKey';

    public function get_users(): void
    {
        $this->verifyNonce();
        $search_term = '';
        if ( ! empty($_GET['search'])) {
            $search_term = sanitize_text_field($_GET['search']);
        }

        $query = new \WP_User_Query(array(
            'search'         => "*{$search_term}*",
            'search_columns' => array(
                'user_login',
                'user_nicename',
                'user_email',
                'user_url',
                'display_name',
            ),
            'role__in'       => array('administrator', 'author', 'contributor', 'editor'),
            'number'         => 10,
            'orderby'        => 'display_name',
            'order'          => 'ASC',
        ));

        $users = $query->get_results();


        $users = array_map(function ($user) {
            return [
                'id'                    => $user->ID,
                'name'                  => $user->display_name,
                'email'                 => $user->user_email,
                'role'                  => $user->roles[0],
                'is_current_user'       => $user->ID === get_current_user_id(),
                'image'                 => get_avatar_url($user->ID),
                'agentwp_access'        => $user->has_cap($this->main->auth::CAP_AGENTWP_ACCESS),
                'agentwp_manager'       => $user->has_cap($this->main->auth::CAP_MANAGE_AGENTWP_CONNECTION),
                'agentwp_users_manager' => $user->has_cap($this->main->auth::CAP_MANAGE_AGENTWP_USERS),
            ];
        }, $users);

        $this->respond($users);
    }

}
