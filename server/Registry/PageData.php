<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Services\AwpRestRoute;

class PageData implements Registrable
{
    private Main $main;

    private ?string $clientId;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->clientId = $this->main->settings->client_id;
    }

    public function register(): void
    {
        add_action('admin_head', [$this, 'pageData']);
    }

    public function pageData()
    {
        $current_user_data = wp_get_current_user()->data;
        // only keep the necessary data
        $current_user = [
            'ID' => $current_user_data->ID,
            'user_email' => $current_user_data->user_email,
            'user_login' => $current_user_data->user_login,
            'user_nicename' => $current_user_data->user_nicename,
            'display_name' => $current_user_data->display_name,
            'avatar_url' => get_avatar_url($current_user_data->ID),
            'roles' => wp_get_current_user()->roles,
        ];

        $agentwp_settings = [
            'home_url' => home_url(),
            'plugin_url' => $this->main->pluginUrl,
            'settings_page' => $this->main->settingsPage,
            'rest_endpoint' => AwpRestRoute::REST_ROUTE_ENDPOINT,
            'rest_route' => rest_url(),
            'admin_route' => admin_url(),
            'nonce' => wp_create_nonce(Main::nonce()),
            'wp_rest_nonce' => wp_create_nonce('wp_rest'),
            'is_admin' => $this->main->auth->isAdmin(),
            'agentwp_manager' => $this->main->auth->isManager(),
            'agentwp_users_manager' => $this->main->auth->canManageUsers(),
            'agentwp_access' => $this->main->auth->hasAccess(),
            'access_token' => $this->main->auth->getAccessToken(),
            'refresh_token' => $this->main->auth->getRefreshToken(),
            'site_id' => $this->main->siteId(),
            'client_id' => $this->clientId,
            'api_host' => $this->main->apiClientHost(),
            'user' => $current_user,
            'onboarding_completed' => $this->main->settings->onboarding_completed,
            'account_settings' => $this->main->accountSettings()->get(),
        ];
        ?>
        <script>
            const agentwp_settings = <?php echo json_encode($agentwp_settings); ?>;
        </script>
        <style>
            body.agentwp-admin-settings {
                background-color: #ffffff;
            }

            .agentwp-components-snackbar-list {
                position: fixed;
                top: 38px;
                right: 32px;
                display: flex;
                flex-direction: column-reverse;
                align-items: flex-end;
            }

            .agentwp-components-snackbar-list-left {
                left: 32px;
                right: unset;
            }

            .components-snackbar {
                padding: 10px 40px;
                color: #fff;
            }

            .agentwp-error-notification {
                background: #ab0909;
            }

            .agentwp-info-notification {
                background: #646464;
            }

            .agentwp-default-notification {
                background: #0e876a;
            }
        </style>
<?php
    }
}
