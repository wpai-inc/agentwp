<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Services\RevokeApiToken;
use WpAi\AgentWp\Traits\GeneralSettingsData;

/**
 * @property string|null $client_id The AWP client ID.
 * @property string|null $client_secret The AWP client secret.
 * @property string|null $site_id The AWP site ID.
 * @property string|null $onboarding_completed The AWP site ID.
 * @property string|null $verification_key The verification key of the site. This is a unique key that is used to verify the site. This key should have a short lifespan.
 * @property array|null $token [ access_token: string, refresh_token: string, expires_in: int, token_type: string] The token data
 * @property array $general [ ] General settings
 */
class Settings
{
    use GeneralSettingsData;

    public $data;

    public array $general_settings = [
        'cleanup_after_deactivate' => [
            'type' => 'boolean',
            'default' => true,
        ],
        'restricted_urls' => [
            'type' => 'string',
            'default' => '',
        ],
    ];

    public function __construct()
    {
        $data = get_option($this->getOptionKey());
        if (! is_array($data)) {
            $data = [];
        }
        $this->data = $data;
    }

    public function getOptionKey(): string
    {
        return Main::prefix('settings');
    }

    public function __get($name)
    {
        return $this->data[$name] ?? null;
    }

    public function set($key, $value = null): bool
    {
        if (is_array($key)) {
            $this->data = array_merge($this->data ?? [], $key);
        } elseif ($value === null) {
            unset($this->data[$key]);
        } else {
            $this->data[$key] = $value;
        }

        return update_option($this->getOptionKey(), $this->data);
    }

    public function delete($key): bool
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

        return update_option($this->getOptionKey(), $this->data);
    }

    public function has($key): bool
    {
        return isset($this->data[$key]) && $this->data[$key] !== '';
    }

    public function setAccessToken($token): bool
    {
        if (extension_loaded('openssl') && defined('AUTH_KEY') && ! empty(AUTH_KEY)) {
            $iv = substr(AUTH_KEY, 0, 16);
            $token['access_token'] = openssl_encrypt($token['access_token'], 'aes-256-cbc', AUTH_KEY, 0, $iv);
            $token['refresh_token'] = $token['refresh_token'] ? openssl_encrypt($token['refresh_token'], 'aes-256-cbc', AUTH_KEY, 0, $iv) : '';
        }

        if ($token['expires_in']) {
            $token['expires_at'] = time() + (int) $token['expires_in'];
        }

        do_action('agentwp_set_access_token', []);

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

    public function isConnected(): bool
    {
        return ! empty($this->data['site_id']) && ! empty($this->data['client_id']) && ! empty($this->data['client_secret']);
    }

    public function disconnectSite($main): void
    {
        (new RevokeApiToken($main))->revoke();
        $this->cleanupConnectionDetails();
    }

    public function cleanupConnectionDetails(): void
    {
        $this->delete(['site_id', 'client_id', 'client_secret', 'token', 'verification_key', 'onboarding_completed']);
    }

    public function getGeneralSettingsDefaultValues(): array
    {
        $defaults = [];
        foreach ($this->general_settings as $key => $value) {
            $defaults[$key] = $value['default'];
        }

        return $defaults;
    }

    public function sanitize_settings($settings): array
    {
        $general_settings = $this->general_settings;
        $defaults = $this->getGeneralSettingsDefaultValues();

        // Merge with defaults and only allow defined keys
        $settings = wp_parse_args($settings, $defaults);
        // validate settings
        foreach ($settings as $key => $value) {
            if (isset($general_settings[$key])) {
                $type = $general_settings[$key]['type'];
                if ($type === 'boolean') {
                    $settings[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                } elseif ($type === 'string') {
                    $settings[$key] = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                } elseif ($type === 'int') {
                    $settings[$key] = filter_var($value, FILTER_VALIDATE_INT);
                }
            }
        }

        return array_intersect_key($settings, $defaults);
    }

    public function getGeneralSettings(): array
    {
        return $this->sanitize_settings($this->data['general_settings'] ?? []);
    }

    public function updateGeneralSettings($data): array
    {
        $general_settings = $this->sanitize_settings($data);
        $this->set('general_settings', $general_settings);

        return $general_settings;
    }

    public function get(string $key)
    {
        $key = explode('.', $key);
        $value = $this->data;
        foreach ($key as $k) {
            if (isset($value[$k])) {
                $value = $value[$k];
            } else {
                return null;
            }
        }

        return $value;
    }
}
