<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\Client\ReactClient;

class Chat extends ReactClient
{
    /**
     * Order matters, earlier locations take precedence.
     */
    protected array $locations = [
        \WpAi\AgentWp\Client\Locations\ElementorChat::class,
        \WpAi\AgentWp\Client\Locations\CoreChat::class,
    ];

    public function data(): array
    {
        return [];
    }
}
