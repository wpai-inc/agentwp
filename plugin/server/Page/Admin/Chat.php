<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;

class Chat extends ReactClient
{
    public function registrations(): void
    {
        add_action('admin_footer', [$this, 'body'], 100);
    }
}
