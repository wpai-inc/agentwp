<?php

namespace WpAi\AgentWp\Modules\AwpClient;

use Exception;

class RouteParamsMissingException extends Exception
{
    public function __construct(string $missing)
    {
        $message = esc_html(sprintf(
            // Translators: %1$s is the list of missing parameters.
            __('You are missing the following params in your request: %1$s', 'agentwp'),
            $missing
        ));
        parent::__construct($message);
    }
}
