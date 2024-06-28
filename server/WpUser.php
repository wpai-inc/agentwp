<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Services\AwpClient;

class WpUser implements Registrable
{

    public function __construct(private Main $main)
    {
    }

    public function register(): void
    {
        add_action('wp_update_user', [$this, 'updateUser']);
        add_action('wp_login', [$this, 'updateUserOnLogin'], 10, 2);
    }

    public function updateUser(): void
    {
        if($this->main->auth()->hasAccess()){
            (new AwpClient($this->main))->updateUser();
        }

    }
    public function updateUserOnLogin($user_login, $user): void
    {
        $userAuth = new UserAuth($user);
        if($userAuth->hasAccess()) {
            (new AwpClient($this->main, false))->setWpUser($user)->updateUser($user->ID);
        }
    }


}
