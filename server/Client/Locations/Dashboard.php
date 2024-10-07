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
        if (! isset($_SERVER['REQUEST_URI'])) {
            return false;
        }

        /**
         * @todo: bad method, this should be hooked into the right hook so that
         * get_current_screen() can be used.
         */
        $requestUri = sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI']));
        $dashboardPage = strpos($requestUri, '/wp-admin/index.php') !== false;

        return is_admin() && $this->client->main->auth()->hasAccess() && $dashboardPage;
    }

    public function root(): void
    {
        //
    }
}
