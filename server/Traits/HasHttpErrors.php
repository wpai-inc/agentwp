<?php

namespace WpAi\AgentWp\Traits;

use WpAi\AgentWp\Http\HttpErrors;

trait HasHttpErrors
{
    protected function errors(): HttpErrors
    {
        return new HttpErrors;
    }

    protected function error(string $http_error_key): \WP_Error
    {
        return $this->errors()->get($http_error_key)->toWpError();
    }
}
