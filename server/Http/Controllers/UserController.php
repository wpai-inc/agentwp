<?php

namespace WpAi\AgentWp\Http\Controllers;

class UserController extends BaseController
{
    protected string $method = 'POST';

    public function acceptTerms()
    {
        $res = $this->main->client()->acceptTerms([
            'ip' => $this->request->getClientIp(),
            'acceptance_url' => home_url(),
        ]);

        if (\is_wp_error($res)) {
            return $this->error('api_request_error');
        }

        return $this->respond($res);
    }
}
