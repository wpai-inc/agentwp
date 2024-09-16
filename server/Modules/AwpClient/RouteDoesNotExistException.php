<?php

namespace WpAi\AgentWp\Modules\AwpClient;

use Exception;

class RouteDoesNotExistException extends Exception
{
    public function __construct(string $routeName)
    {
        parent::__construct("Route $routeName does not exist");
    }
}
