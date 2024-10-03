<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Http\HttpRequest;

class BeaverBuilder implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    protected HttpRequest $request;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
        $this->request = new HttpRequest;
    }

    public function active(): bool
    {
        return $this->request->get('fl_builder') && $this->client->main->auth()->hasAccess() && class_exists('FLBuilderLoader');
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
