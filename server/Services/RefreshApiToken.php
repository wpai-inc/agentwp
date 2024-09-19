<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;

class RefreshApiToken
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function refresh()
    {
        try {
            $refresh_token = $this->main->settings->getRefreshToken();
            $client_id = $this->main->settings->client_id;
            $client_secret = $this->main->settings->client_secret;
            if (! $refresh_token || ! $client_id || ! $client_secret) {
                return null;
            }
            $response = $this->main->client()
                ->passportToken([
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refresh_token,
                    'client_id' => $this->main->settings->client_id,
                    'client_secret' => $this->main->settings->client_secret,
                    'scope' => 'site_connection',
                ]);

            if (is_a($response, 'WP_Error')) {
                throw new \Exception($response->get_error_message());
            }

            $this->main->settings->setAccessToken($response);

            return $response;
        } catch (\Exception $e) {
            // Do nothing
            error_log($e->getMessage());
        }

        return null;
    }
}
