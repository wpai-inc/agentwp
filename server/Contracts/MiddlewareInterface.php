<?php

namespace WpAi\AgentWp\Contracts;

use WpAi\AgentWp\Main;

interface MiddlewareInterface
{
    public function __construct(Main $main);

    /**
     * Handle an incoming request.
     *
     * @return mixed
     */
    public function handle(\WP_REST_Request $request);
}
