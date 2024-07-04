<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Services\RevokeApiToken;

/**
 * @property string|null $client_id The AWP client ID.
 * @property string|null $client_secret The AWP client secret.
 * @property string|null $site_id The AWP site ID.
 * @property string|null $onboarding_completed The AWP site ID.
 * @property string|null $verification_key The verification key of the site. This is a unique key that is used to verify the site. This key should have a short lifespan.
 * @property array|null $token [ access_token: string, refresh_token: string, expires_in: int, token_type: string] The token data
 */
class Settings
{

    public mixed $data;

    public function __construct()
    {
        $data = get_option('agentwp_settings');
        if ( ! is_array($data)) {
            $data = [];
        }
        $this->data = $data;
    }

    public function __get($name)
    {
        return $this->data[$name] ?? null;
    }

    public function set(string|array $key, $value = null): bool
    {

        if (is_array($key)) {
            $this->data = array_merge($this->data ?? [], $key);
        } elseif ($value === null) {
            unset($this->data[$key]);
        } else {
            $this->data[$key] = $value;
        }

        return update_option('agentwp_settings', $this->data);
    }

    public function delete(string|array $key): bool
    {
        if (is_array($key)) {
            foreach ($key as $k) {
                if (isset($this->data[$k])) {
                    unset($this->data[$k]);
                }
            }
        } else {
            if (isset($this->data[$key])) {
                unset($this->data[$key]);
            }
        }

        return update_option('agentwp_settings', $this->data);
    }

    public function has($key): bool
    {
        return isset($this->data[$key]) && $this->data[$key] !== '';
    }

    public function setAccessToken(mixed $token): bool
    {
        if (extension_loaded('openssl') && defined('AUTH_KEY') && ! empty(AUTH_KEY)) {
            $iv                     = substr(AUTH_KEY, 0, 16);
            $token['access_token']  = openssl_encrypt($token['access_token'], 'aes-256-cbc', AUTH_KEY, 0, $iv);
            $token['refresh_token'] = $token['refresh_token'] ? openssl_encrypt($token['refresh_token'], 'aes-256-cbc', AUTH_KEY, 0, $iv) : '';
        }

        if ($token['expires_in']) {
            $token['expires_at'] = time() + (int) $token['expires_in'];
        }

        return $this->set('token', $token);
    }

    public function getAccessToken(): ?string
    {

        if (empty($this->data['token']['access_token'])) {
            return null;
        }
        if (extension_loaded('openssl') && defined('AUTH_KEY') && ! empty(AUTH_KEY)) {
            $iv = substr(AUTH_KEY, 0, 16);

            return openssl_decrypt($this->data['token']['access_token'], 'aes-256-cbc', AUTH_KEY, 0, $iv);
        }

        return $this->data['token']['access_token'];
    }

    public function getRefreshToken(): ?string
    {

        if (empty($this->data['token']['refresh_token'])) {
            return null;
        }
        if (extension_loaded('openssl') && defined('AUTH_KEY') && ! empty(AUTH_KEY)) {
            $iv = substr(AUTH_KEY, 0, 16);

            return openssl_decrypt($this->data['token']['refresh_token'], 'aes-256-cbc', AUTH_KEY, 0, $iv);
        }

        return $this->data['token']['refresh_token'];
    }

    public function isConnectedToAwp(): bool
    {
        return ! empty($this->data['site_id']) && ! empty($this->data['client_id']) && ! empty($this->data['client_secret']);
    }

    public function disconnectSite($main): void
    {
        (new RevokeApiToken($main))->revoke();
        $this->delete(['site_id', 'client_id', 'client_secret', 'token', 'verification_key', 'onboarding_completed']);
    }
}
