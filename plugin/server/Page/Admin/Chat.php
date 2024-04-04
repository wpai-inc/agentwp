<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;

class Chat extends ReactClient
{
    public function register()
    {
        add_action('admin_footer', [$this, 'body'], 100);
    }
}
