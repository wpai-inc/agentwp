<?php

namespace WpAi\AgentWp;

/**
 * Main plugin class
 *
 * Contains a lot of the configuration and common functionality for the plugin.
 * All providers depend on this class.
 *
 * @since 0.1.0
 */
class Main
{
    const SLUG = 'agent-wp';

    const PLUGIN_VERSION = '0.1.0';

    const BUILD_DIR = 'build';

    public $companyName = 'Agent WP';

    public $attributionUrl = 'https://agentwp.com';

    /**
     * Temporary for demo,
     * before auth is implemented.
     */
    public string $siteId;
    private string $clientId;

    public function __construct(private string $file)
    {
        $this->siteId   = get_option('agentwp_site_id')['site_id'] ?? '';
        $this->clientId = get_option('agentwp_site_id')['client_id'] ?? '';
        add_action('admin_head', [$this, 'printDefaultVars']);
    }

    public function buildPath(): string
    {
        return $this->path(self::BUILD_DIR);
    }

    public function asset(?string $path = null): string
    {
        return $this->url(self::BUILD_DIR . '/' . $path);
    }

    public function pluginPath(): string
    {
        return $this->file;
    }

    public function path(?string $path = null): string
    {
        return plugin_dir_path($this->file) . ltrim($path, '/');
    }

    public function url(?string $path = null): string
    {
        return plugins_url($path, $this->file);
    }

    public static function nonce(): string
    {
        return self::SLUG;
    }

    public function apiHost()
    {
        return defined('AGENTWP_API_HOST') ? AGENTWP_API_HOST : 'https://api.agentwp.com';
    }

    public function printDefaultVars()
    {

        $awp_settings      = get_option('agentwp_site_id');
        $current_user_role = wp_get_current_user()->roles[0] ?? '';

        $is_agentwp_manager = current_user_can('agentwp_manager');

        $can_manage_users  = current_user_can('manage_agentwp_users') || $is_agentwp_manager;
        if (empty($awp_settings['site_id'])) {
            if ($current_user_role === 'administrator') {
                $can_manage_users = true;
                $is_agentwp_manager = true;
            }
        }
        $has_agentwp_access = false;
        $access_token   = '';
        if (current_user_can('agentwp_access') || $can_manage_users || $is_agentwp_manager) {
            $has_agentwp_access = true;
            $access_token   = get_option('agentwp_access_token');
            if (extension_loaded('openssl')) {
                $access_token['access_token'] = openssl_decrypt($access_token['access_token'], 'aes-256-cbc', AUTH_KEY, 0, AUTH_KEY);
                $access_token['refresh_token'] = openssl_encrypt($access_token['refresh_token'], 'aes-256-cbc', AUTH_KEY, 0, AUTH_KEY);
            }
        }

        $agentwp_settings = [
            'nonce'                 => wp_create_nonce('agentwp_settings'),
            'is_admin'              => $current_user_role === 'administrator' || $current_user_role === 'super_admin',
            'agentwp_manager'       => $is_agentwp_manager,
            'agentwp_users_manager' => $can_manage_users,
            'agentwp_access'        => $has_agentwp_access,
            'access_token'          => $access_token,
            'site_id'               => $this->siteId,
            'client_id'             => $this->clientId,
            'api_host'              => $this->apiHost(),
            'user_email'            => wp_get_current_user()->user_email ?? '',
        ];
?>
        <script>
            const agentwp_settings = <?php echo json_encode($agentwp_settings); ?>;
        </script>
<?php
    }
}
