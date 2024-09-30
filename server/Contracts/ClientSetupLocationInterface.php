<?php

namespace WpAi\AgentWp\Contracts;

use WpAi\AgentWp\Client\ReactClient;

interface ClientSetupLocationInterface
{
    public function __construct(ReactClient $client);

    public function active(): bool;

    public function root(): void;
}
