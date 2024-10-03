<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Http\HttpRequest;

class ElementorChat implements ClientSetupLocationInterface
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
        return is_admin() && $this->client->main->auth()->hasAccess() && $this->request->get('action') === 'elementor';
    }

    public function root(): void
    {
        add_action('elementor/editor/wp_head', [$this->client, 'appRoot'], 100);
    }

    public function setup(): void
    {
        add_action('elementor/editor/after_enqueue_scripts', [$this->client, 'enqueue_client_assets'], 100);
        add_action('elementor/editor/after_enqueue_scripts', [$this->client, 'registerPageProps'], 101);
    }
}
