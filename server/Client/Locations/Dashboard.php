<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class Dashboard implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        return is_admin() &&  $this->client->main->auth()->hasAccess();
    }

    public function setup(): void
    {
        add_action('wp_dashboard_setup', [$this->client, 'dashboard_widget']);
        add_action('wp_dashboard_setup', [$this->client, 'widget_position'], 20);
    }
}
