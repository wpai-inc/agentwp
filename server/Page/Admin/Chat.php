<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;

class Chat extends ReactClient
{
    public function registrations(): void
    {
        add_action('admin_init', [$this, 'registerChat']);
    }

    public function registerChat(): void
    {
        if (current_user_can(('agentwp_manager')) || current_user_can(('manage_agentwp_users')) || current_user_can(('agentwp_access'))) {
            add_action('admin_footer', [$this, 'appRoot'], 100);
        }
    }
}
