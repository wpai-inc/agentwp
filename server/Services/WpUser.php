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
        add_action('wp_update_user', [$this, 'updateUser'], 10, 2);
    }
    public function updateUser(): void
    {
        // Update the user in the agentwp
        $user = wp_get_current_user();
        $awpClient = new AwpClient($this->main);
        $awpClient->updateUser( [
            'site_id' => $this->main->siteId(),
            'wp_user_id' => $user->ID,
            'display_name' => $user->display_name,
            'nice_name' => $user->user_nicename,
            'role' => $user->roles[0]
        ]);

    }


}
