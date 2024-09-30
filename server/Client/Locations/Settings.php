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

    public function root(): void
    {
        //
    }
}
