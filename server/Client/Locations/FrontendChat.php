<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class FrontendChat implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        return ! is_admin() && $this->client->main->auth()->hasAccess();
    }

    public function root(): void
    {
        add_action('wp_footer', [$this->client, 'appRoot'], 100);
    }

    public function setup(): void
    {
        add_action('wp_enqueue_scripts', [$this->client, 'enqueue_client_assets']);
        add_action('wp_enqueue_scripts', [$this->client, 'registerPageProps']);
        add_filter('body_class', [$this, 'bodyClass']);
    }
}
