<?php

namespace WpAi\AgentWp\Http\Middleware;

use WP_REST_Request;

class CheckRestRequestNonce extends Middleware
{
    public function handle(WP_REST_Request $request)
    {
        $nonce = $request->get_header('x-wp-nonce') ?: $request->get_param('_wpnonce');
        if (empty($nonce) || ! wp_verify_nonce($nonce, 'wp_rest')) {
            return $this->error('invalid_nonce');
        }
    }
}
