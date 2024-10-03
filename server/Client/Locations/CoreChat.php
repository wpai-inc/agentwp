<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Http\HttpRequest;

class CoreChat implements ClientSetupLocationInterface
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
        $page = $this->request->get('page', true);

        return is_admin() && $this->client->main->auth()->hasAccess() && ! in_array($page, [$this->client->main::SETTINGS_PAGE]);
    }

    public function root(): void
    {
        add_action('in_admin_header', [$this->client, 'appRoot'], 100);
    }
}
