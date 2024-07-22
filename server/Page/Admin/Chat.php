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
        add_action('in_admin_header', [$this, 'appRoot'], 100);
    }
}
