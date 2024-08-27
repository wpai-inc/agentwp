<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class BricksBuilder implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;

    }

    public function active(): bool
    {
        return isset($_GET['bricks']) && $_GET['bricks'] === 'run' && !isset($_GET['brickspreview']);
    }

    public function setup(): void
    {
        add_action('wp_enqueue_scripts', [$this->client, 'enqueue_client_assets']);
        add_action('wp_enqueue_scripts', [$this->client, 'registerPageProps']);
        add_action('wp_footer', [$this->client, 'appRoot']);
    }
}
