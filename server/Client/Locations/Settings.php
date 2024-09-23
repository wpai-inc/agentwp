<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class Settings implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        return is_admin() && $this->client->main->auth()->hasAccess() && isset($_GET['page']) && in_array($_GET['page'], [$this->client->main::SETTINGS_PAGE]);
    }

    public function setup(): void
    {
        add_action('admin_enqueue_scripts', [$this->client, 'enqueue_client_assets']);
        add_action('admin_enqueue_scripts', [$this->client, 'registerPageProps']);
        add_filter('admin_body_class', [$this->client, 'bodyClass']);
        add_action('wp_ajax_'.$this->client->slug('_'), [$this->client, 'registerControllers']);
    }
}
