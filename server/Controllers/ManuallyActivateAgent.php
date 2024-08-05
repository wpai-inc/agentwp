<?php

namespace WpAi\AgentWp\Controllers;

class ManuallyActivateAgent extends BaseController
{

    protected string $method = 'POST';
    protected string $permission = 'canGenerateVerificationKey';

    public function activate()
    {
        $this->verifyNonce();

        $data = json_decode(file_get_contents('php://input'), true);
        $data = json_decode(base64_decode($data['apiKey']), true);

        if(!$data['site_id'] || !$data['client_id'] || !$data['client_secret'] || !$data['token']['access_token'] || !$data['token']['expires_in']){
            $this->error([
                'message' => 'Invalid data',
            ]);
        }

        $this->main->settings->set([
            'site_id'       => sanitize_text_field($data['site_id']),
            'client_id'     => sanitize_text_field($data['client_id']),
            'client_secret' => sanitize_text_field($data['client_secret']),
        ]);
        $this->main->settings->setAccessToken([
            'access_token'  => sanitize_text_field($data['token']['access_token']),
            'token_type'    => 'Bearer',
            'refresh_token' => '',
            'expires_in'    => sanitize_text_field($data['token']['expires_in']),
        ]);

        $this->respond([
            'settings' => $this->main->settings->data,
        ]);
    }
}
