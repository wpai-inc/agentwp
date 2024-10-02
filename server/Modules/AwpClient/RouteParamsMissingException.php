<?php

namespace WpAi\AgentWp\Modules\AwpClient;

use Exception;

class RouteParamsMissingException extends Exception
{
    public function __construct(string $missing)
    {
        parent::__construct(esc_html__('You are missing the following params in your request: ', 'agentwp').esc_html($missing));
    }
}
