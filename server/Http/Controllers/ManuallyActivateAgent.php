<?php

namespace WpAi\AgentWp\Http\Controllers;

class ManuallyActivateAgent extends BaseController
{
    protected string $method = 'POST';

    protected string $permission = 'canGenerateVerificationKey';

    public function __invoke()
    {
        $data = $this->request->getJsonContent();
        $apiKey = json_decode(base64_decode($data['apiKey']), true);

        if (! $apiKey['site_id'] || ! $apiKey['client_id'] || ! $apiKey['client_secret'] || ! $apiKey['token']['access_token'] || ! $apiKey['token']['expires_in']) {
            $this->error('failed_site_verification');
        }

        $this->main->settings->set([
            'site_id' => sanitize_text_field($apiKey['site_id']),
            'client_id' => sanitize_text_field($apiKey['client_id']),
            'client_secret' => sanitize_text_field($apiKey['client_secret']),
        ]);

        $this->main->settings->setAccessToken([
            'access_token' => sanitize_text_field($apiKey['token']['access_token']),
            'token_type' => 'Bearer',
            'refresh_token' => '',
            'expires_in' => sanitize_text_field($apiKey['token']['expires_in']),
        ]);

        $this->main->auth->makeCurrentUserManager();

        $this->respond([
            'settings' => $this->main->settings->data,
        ]);
    }
}
