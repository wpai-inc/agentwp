<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class WpUser implements Registrable
{
    public function __construct(private Main $main) {}

    public function register(): void
    {
        add_action('wp_update_user', [$this, 'updateUser']);
        add_action('wp_login', [$this, 'updateUserOnLogin'], 10, 2);
    }

    public function updateUser(): void
    {
        if ($this->main->auth()->hasAccess()) {
            $this->main->client()->updateUser();
        }
    }

    public function updateUserOnLogin($user_login, $user): void
    {
        $userAuth = new UserAuth($user);
        if ($userAuth->hasAccess()) {
            $this->main->client()->setWpUser($user)->updateUser($user->ID);
        }
    }
}
