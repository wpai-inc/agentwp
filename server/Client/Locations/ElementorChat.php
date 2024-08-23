<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class ElementorChat implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        return is_admin() && isset($_GET['action']) && $_GET['action'] === 'elementor';
    }

    public function setup(): void
    {
        add_action('elementor/editor/after_enqueue_scripts', [$this->client, 'enqueue_client_assets'], 100);
        add_action('elementor/editor/after_enqueue_scripts', [$this->client, 'registerPageProps'], 101);
        add_action('elementor/editor/wp_head', [$this->client, 'appRoot'], 100);
    }
}