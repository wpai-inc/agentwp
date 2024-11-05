<?php

namespace WpAi\AgentWp\Page\Frontend;

use WpAi\AgentWp\Client\ReactClient;

class Chat extends ReactClient
{
    protected array $locations = [
        \WpAi\AgentWp\Client\Locations\FrontendChat::class,
    ];

    public function data(): array
    {
        return [];
    }
}
