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
        /**
         * @todo: bad method, this should be hooked into the right hook so that
         * get_current_screen() can be used.
         */
        $dashboardPage = strpos(\esc_url_raw($_SERVER['REQUEST_URI']), '/wp-admin/index.php') !== false;

        return is_admin() && $this->client->main->auth()->hasAccess() && $dashboardPage;
    }

    public function root(): void
    {
        //
    }
}
