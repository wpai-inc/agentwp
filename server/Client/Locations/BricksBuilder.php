<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Http\HttpRequest;

class BricksBuilder implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    private HttpRequest $request;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
        $this->request = new HttpRequest;
    }

    public function active(): bool
    {
        return $this->request->get('bricks') && $this->request->get('bricks') === 'run' && ! $this->request->get('brickspreview') && $this->client->main->auth()->hasAccess();
    }

    public function root(): void
    {
        add_action('wp_footer', [$this->client, 'appRoot']);
    }

    public function setup(): void
    {
        add_action('wp_enqueue_scripts', [$this->client, 'enqueue_client_assets']);
        add_action('wp_enqueue_scripts', [$this->client, 'registerPageProps']);
    }
}
