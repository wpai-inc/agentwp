<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class CoreChat implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        if (! isset($_GET['page'])) {
            return false;
        }

        $page = sanitize_text_field(wp_unslash($_GET['page']));

        return is_admin() && $this->client->main->auth()->hasAccess() && ! in_array($page, [$this->client->main::SETTINGS_PAGE]);
    }

    public function root(): void
    {
        add_action('in_admin_header', [$this->client, 'appRoot'], 100);
    }
}
