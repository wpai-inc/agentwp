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
        if (! function_exists('get_current_screen')) {
            return false;
        }

        $screen = get_current_screen();
        if (! $screen || ! isset($screen->id) || $screen->id !== 'dashboard') {
            return false;
        }

        return is_admin() && $this->client->main->auth()->hasAccess();
    }

    public function root(): void
    {
        //
    }
}
