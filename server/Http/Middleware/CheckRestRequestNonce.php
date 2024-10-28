<?php

namespace WpAi\AgentWp\Http\Middleware;

use WP_REST_Request;

class CheckRestRequestNonce extends Middleware
{
    public function handle(WP_REST_Request $request)
    {
        $nonce = $request->get_header('x-wp-nonce');
        if (! $nonce) {
            return new \WP_Error('rest_forbidden', 'Nonce is required', ['status' => 403]);
        }
        if (! wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_Error('rest_forbidden', 'Invalid nonce', ['status' => 403]);
        }
    }
}
