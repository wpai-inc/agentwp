<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;

class DashboardWidget extends ReactClient
{
    use HasMenu, HasPage;

    public array $pageData = [];

    protected array $locations = [
        \WpAi\AgentWp\Client\Locations\Dashboard::class,
    ];

    public function dashboard_widget()
    {
        wp_add_dashboard_widget(
            $this->pageName, // Widget slug.
            '<!-- @todo: SVG Logo to be embedded here --> AgentWP',
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

    public function setup(): void
    {
        add_action('wp_dashboard_setup', [$this, 'dashboard_widget']);
        add_action('wp_dashboard_setup', [$this, 'widget_position'], 20);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_client_assets']);
        add_action('admin_enqueue_scripts', [$this, 'registerPageProps']);
        add_filter('admin_body_class', [$this, 'bodyClass']);
    }
}
