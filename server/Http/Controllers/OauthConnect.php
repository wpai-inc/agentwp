<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Services\GenerateUniqueVerificationKey;

class OauthConnect extends BaseController
{
    protected string $method = 'GET';

    public function __invoke()
    {

        $verification_key = (new GenerateUniqueVerificationKey($this->main->settings))->get();
        $current_user = wp_get_current_user();

        $connect_url_query_strings = [
            'website' => home_url(),
            'user_email' => $current_user->data->user_email,
            'verification_key' => $verification_key,
        ];

        $this->respond(['url' => $this->main->apiHost().'/connect_site?'.http_build_query($connect_url_query_strings)]);

    }

    public function check_permission(): bool
    {
        return $this->main->auth()->canGenerateVerificationKey();
    }
}
