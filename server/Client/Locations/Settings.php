<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Http\HttpRequest;

class Settings implements ClientSetupLocationInterface
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
        return is_admin() && $this->client->main->auth()->hasAccess() && $this->request->get('page') && in_array($this->request->get('page'), [$this->client->main::SETTINGS_PAGE]);
    }

    public function root(): void
    {
        //
    }
}
