<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;

class WpUser implements Registrable
{

    public function __construct(private Main $main)
    {
    }

    public function register(): void
    {
        add_action('wp_update_user', [$this, 'updateUser']);
        add_action('wp_login', [$this, 'updateUser']);
    }
    public function updateUser(): void
    {
        // Update the user in the agentwp
        $user = wp_get_current_user();
        $awpClient = new AwpClient($this->main);
        $awpClient->updateUser( [
            'display_name' => $user->display_name,
            'nicename' => $user->user_nicename,
            'role' => $user->roles[0]
        ]);

    }


}
