<?php

namespace WpAi\AgentWp\Client\Locations;

use WpAi\AgentWp\Client\ReactClient;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;

class CustomizePage implements ClientSetupLocationInterface
{
    protected ReactClient $client;

    public function __construct(ReactClient $client)
    {
        $this->client = $client;
    }

    public function active(): bool
    {
        if (! isset($_SERVER['PHP_SELF'])) {
            return false;
        }

        $php_self = sanitize_text_field(wp_unslash($_SERVER['PHP_SELF']));

        return is_admin() && $this->client->main->auth()->hasAccess() && basename($php_self) === 'customize.php';
    }

    public function root(): void
    {
        add_action('customize_controls_print_footer_scripts', [$this->client, 'appRoot'], 122);
    }

    public function setup(): void
    {
        add_action('customize_controls_enqueue_scripts', [$this->client, 'enqueue_client_assets']);
        add_action('customize_controls_enqueue_scripts', [$this->client, 'registerPageProps']);
        add_filter('admin_body_class', [$this->client, 'bodyClass']);
    }
}
