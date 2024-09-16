<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\UserAuth;

class WpUser implements Registrable
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register(): void
    {
        add_action('wp_update_user', [$this, 'updateUser']);
        add_action('wp_login', [$this, 'updateUserOnLogin'], 10, 2);
    }

    public function updateUser(): void
    {
        if ($this->main->auth()->hasAccess()) {
            $this->main->client()->wpuserUpdate();
        }
    }

    public function updateUserOnLogin($user_login, $user): void
    {
        $userAuth = new UserAuth($user);
        if ($userAuth->hasAccess()) {
            $this->main->client()->setWpUser($user)->wpuserUpdate([
                'display_name' => $user->display_name,
                'nicename' => $user->user_nicename,
                'role' => $user->roles[0],
            ]);
        }
    }
}
