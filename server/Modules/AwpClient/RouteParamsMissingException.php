<?php

namespace WpAi\AgentWp\Modules\AwpClient;

use Exception;

class RouteParamsMissingException extends Exception
{
    public function __construct(array $missing)
    {
        $params = implode(', ', $missing);
        parent::__construct("You are missing the following params in your request: $params");
    }
}
