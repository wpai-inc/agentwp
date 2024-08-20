<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;

class Chat extends ReactClient
{
    public function active(): bool
    {
        return ! in_array($_GET['page'], ['agentwp-admin-settings']);
    }

    public function registrations(): void
    {
        add_action('admin_init', [$this, 'registerChat']);
        add_action('elementor/app/init', [$this, 'registerChat']);
    }

    public function data(): array
    {
        return [];
    }

    public function registerChat(): void
    {
        add_action('in_admin_header', [$this, 'appRoot'], 100);
        add_action('elementor/editor/wp_head', [$this, 'appRoot'], 100);
    }
}
