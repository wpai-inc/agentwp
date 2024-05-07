<?php

namespace WpAi\AgentWp;

class Settings
{
    private mixed $data;

    public function __construct()
    {
        $this->data = get_option('agentwp_site_id');
    }

    public function __get($name)
    {
        return $this->data[$name] ?? null;
    }

    public function has($name): bool
    {
        return isset($this->data[$name]) && ! empty($this->data[$name]);
    }

    public function getAccessToken(): ?array
    {
        $access_token = get_option('agentwp_access_token');

        if ($access_token === false) {
            return null;
        }

        if (extension_loaded('openssl') && isset($access_token['access_token'], $access_token['refresh_token'])) {
            $access_token['access_token'] = openssl_decrypt($access_token['access_token'], 'aes-256-cbc', AUTH_KEY, 0, AUTH_KEY);
            $access_token['refresh_token'] = openssl_encrypt($access_token['refresh_token'], 'aes-256-cbc', AUTH_KEY, 0, AUTH_KEY);
        }

        return $access_token;
    }
}
