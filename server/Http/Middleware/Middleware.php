<?php

namespace WpAi\AgentWp\Http\Middleware;

use WP_REST_Request;
use WpAi\AgentWp\Contracts\MiddlewareInterface;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\HasHttpErrors;

abstract class Middleware implements MiddlewareInterface
{
    use HasHttpErrors;

    protected Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    abstract public function handle(WP_REST_Request $request);
}
