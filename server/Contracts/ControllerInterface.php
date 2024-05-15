<?php

namespace WpAi\AgentWp\Contracts;

use WpAi\AgentWp\Enums\RouteMethods;

interface ControllerInterface
{
    public function method(): RouteMethods;
}
