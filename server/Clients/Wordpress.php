<?php

namespace WpAi\AgentWp\Clients;

use WpAi\AgentWp\Main;

class Wordpress
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }
}
