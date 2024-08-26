<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class CustomizePage implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        return is_admin();
    }

    public function setup(): void
    {
        add_action('admin_init', [$this, 'registerChat']);
        add_action('customize_controls_enqueue_scripts', [$this->client, 'enqueue_client_assets']);
        add_action('customize_controls_enqueue_scripts', [$this->client, 'registerPageProps']);
        add_filter('admin_body_class', [$this->client, 'bodyClass']);
        add_action('wp_ajax_'.$this->client->slug('_'), [$this->client, 'registerControllers']);
    }

    public function registerChat(): void
    {
        add_action('customize_controls_print_footer_scripts', [$this->client, 'appRoot'], 100);
    }
}
