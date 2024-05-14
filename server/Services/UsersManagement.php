<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\UserAuth;

class UsersManagement implements Registrable
{
    private UserAuth $user;

    public function __construct(private Main $main)
    {
        $this->user = new UserAuth();

    }

    public function register(): void
    {
        new AwpRestRoute('agentwp_users', [$this, 'get_users'], [$this->user, 'canGenerateVerificationKey']);
        (new AwpRestRoute('user', [$this, 'update_user_capabilities'], UserAuth::CAP_MANAGE_AGENTWP_USERS))->method('POST');

    }

    public function get_users(): void
    {
        // validate nonce
        if (!wp_verify_nonce($_REQUEST['agentwp_nonce'], $this->main::SLUG)) {
            wp_send_json_error('Invalid nonce', 401);
        }
        $search_term = $_GET['search'] ?? '';

        $query = new \WP_User_Query(array(
            'search'         => "*{$search_term}*",
            'search_columns' => array(
                'user_login',
                'user_nicename',
                'user_email',
                'user_url',
                'display_name',
            ),
            'role__in' => array('administrator', 'author', 'contributor', 'editor'),
            'number' => 10,
            'orderby' => 'display_name',
            'order' => 'ASC',
        ));

        $users = $query->get_results();


        $users = array_map(function ($user) {
            return [
                'id' => $user->ID,
                'name' => $user->display_name,
                'email' => $user->user_email,
                'role' => $user->roles[0],
                'is_current_user' => $user->ID === get_current_user_id(),
                'image' => get_avatar_url($user->ID),
                'agentwp_access' => $user->has_cap(UserAuth::CAP_AGENTWP_ACCESS),
                'agentwp_manager' => $user->has_cap(UserAuth::CAP_MANAGE_AGENTWP_CONNECTION),
                'agentwp_users_manager' => $user->has_cap(UserAuth::CAP_MANAGE_AGENTWP_USERS),
            ];
        }, $users);

        wp_send_json($users);
    }


    public function update_user_capabilities(): void
    {
        if ( ! wp_verify_nonce($_GET['agentwp_nonce'], $this->main::SLUG)) {
            wp_send_json_error('Invalid nonce');
        }

        $data    = json_decode(file_get_contents('php://input'), true);
        $user_id = sanitize_text_field($data['user']);
        $user    = new \WP_User($user_id);
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
        wp_send_json_success();
    }

}
