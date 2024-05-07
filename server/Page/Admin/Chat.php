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
        if ($this->main->auth()->canManageUsers()) {
            add_action('admin_footer', [$this, 'appRoot'], 100);
        }
    }
}
