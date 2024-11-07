<?php

namespace WpAi\AgentWp\Http\Controllers;

class TestResponse extends BaseController
{
    public function successfulResponse(): void
    {
        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);

        $this->respond([
            'key' => $key,
            'home_url' => home_url(),
            'foo' => $this->request->get('foo'),
        ]);
    }
}
