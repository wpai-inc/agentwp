<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;

class DashboardWidget extends ReactClient
{
    use HasMenu, HasPage;

    public array $pageData = [];

    public function registrations(): void
    {
        add_action('wp_dashboard_setup', [$this, 'dashboard_widget']);
        add_action('wp_dashboard_setup', [$this, 'widget_position'], 20);
    }

    public function active(): bool
    {
        if (! is_admin() || ! function_exists('get_current_screen')) {
            return false;
        }

        $screen = get_current_screen();

        return $screen->id == 'dashboard';
    }

    public function dashboard_widget()
    {
        wp_add_dashboard_widget(
            $this->pageName, // Widget slug.
            <<<'EOT'
                <!-- @todo: SVG Logo to be embedded here -->
                AgentWP
            EOT,
            [$this, 'appRoot']  // Display function.
        );
    }

    public function widget_position()
    {
        global $wp_meta_boxes;
        $widget = $wp_meta_boxes['dashboard']['normal']['core'][$this->pageName];
        unset($wp_meta_boxes['dashboard']['normal']['core'][$this->pageName]);
        $wp_meta_boxes['dashboard']['side']['high'][$this->pageName] = $widget;
    }

    public function data(): array
    {
        return [];
    }
}
