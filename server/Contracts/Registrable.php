<?php

namespace WpAi\AgentWp\Contracts;

use WpAi\AgentWp\Main;

interface Registrable
{
    public function __construct(Main $main);

    public function register();
}
