<?php

namespace WpAi\AgentWp\Controllers;

class TestResponse extends BaseController
{
    public function test_response(): void
    {
        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);

        $this->respond([
            'key' => $key,
            'home_url' => home_url(),
        ]);
    }
}
