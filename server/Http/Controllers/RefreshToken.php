<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Services\RefreshApiToken;
use WpAi\AgentWp\UserAuth;

class RefreshToken extends BaseController
{
    protected string $permission = UserAuth::CAP_AGENTWP_ACCESS;

    public function __invoke(): void
    {
        $new_api_token = (new RefreshApiToken($this->main))->refresh();

        if (! is_a($new_api_token, 'WP_Error')) {
            $this->respondWithError($new_api_token->get_error_message(), $new_api_token->get_error_code());
        }

        $this->respond(['message' => 'Token refreshed successfully']);
    }
}
