<?php

namespace WpAi\AgentWp\Controllers;

class QueryActionController extends BaseController
{
    public function query(): void
    {
        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);

        $this->respond([
            'key' => $key,
            'home_url' => home_url(),
        ]);
    }
}
