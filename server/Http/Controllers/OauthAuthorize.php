<?php

namespace WpAi\AgentWp\Http\Controllers;

class OauthAuthorize extends BaseController
{
    protected string $method = 'GET';

    public function __invoke()
    {

        $redirect_url = $this->main->settingsPageUrl;

        $connect_url_query_strings = [
            'client_id' => $this->main->settings->client_id,
            'redirect_url' => urlencode($redirect_url),
            'response_type' => 'code',
            'scope' => 'site_connection',
        ];

        return ['url' => $this->main->apiHost().'/connect_site?'.http_build_query($connect_url_query_strings)];
    }
}
