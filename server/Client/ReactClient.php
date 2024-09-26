<?php

namespace WpAi\AgentWp\Client;

use Kucrut\Vite;
use WpAi\AgentWp\Contracts\ClientAppInterface;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Services\AwpRestRoute;

abstract class ReactClient implements ClientAppInterface, Registrable
{
    protected string $pageName;

    public Main $main;

    protected array $locations = [];

    protected ?ClientSetupLocationInterface $location = null;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->pageName =
            str_replace('\\', '/', str_replace('WpAi\\AgentWp\\Page\\', '', get_class($this)));
        $this->setLocation();
    }

    public function setLocation(): void
    {
        if (method_exists($this, 'onLocations')) {
            $this->onLocations();
        }

        foreach ($this->locations as $location) {
            if (! class_exists($location)) {
                throw new \Error('Location class does not exist: '.$location);
            }
            $setup = new $location($this);
            if ($setup && $setup->active()) {
                $this->location = $setup;
            }
        }
    }

    public function registrations(): void {}

    /**
     * Register the client and anything else.
     */
    public function register()
    {
        $this->registrations();

        if ($this->location) {
            $this->location->setup();
        }
    }

    public function setPageName(string $name): self
    {
        $this->pageName = $name;

        return $this;
    }

    /**
     * Entrypoint to the Client Page
     */
    public function clientPage(): string
    {
        return 'Page/'.$this->pageName.'/Index.tsx';
    }

    /**
     * Unique page slug
     */
    public function slug($sep = '-'): string
    {
        return str_replace('-', $sep, $this->main::SLUG).$sep.str_replace('/', $sep, \strtolower($this->pageName));
    }

    /**
     * Adds a class to the body tag
     */
    public function bodyClass(string $classes): string
    {
        $classes .= ' '.$this->slug();

        return $classes;
    }

    public function enqueue_client_assets()
    {
        Vite\enqueue_asset(
            $this->main->buildPath(),
            $this->clientPage(),
            [
                'dependencies' => ['react', 'react-dom'],
                'handle' => $this->slug(),
                'in-footer' => true,
            ]
        );
    }

    public function appRoot(): void
    {
        if ($this->main->auth()->hasAccess()) {
            ?>
            <noscript>
                <div class="no-js">
                    <?php
                                echo esc_html__(
                                    'Warning: AgentWP will not work properly without JavaScript, please enable it.',
                                    'agentwp'
                                );
            ?>
                </div>
            </noscript>
            <div id="<?php echo $this->slug() ?>"></div>
        <?php
        } else {
            $managers = $this->main->auth->managers();
            ?>
            <div>
                <h1>AgentWP</h1>
                <div>
                    <p>
                        <?php
                            echo esc_html__(
                                'You do not have permission to access AgentWP. Please request access to AgentWP from your AgentWP manager.',
                                'agentwp'
                            );
            ?>
                    </p>
                    <div>
                        <strong>AgentsWP Managers:</strong>
                        <ul>
                            <?php
                foreach ($managers as $manager) {
                    echo "<li>{$manager->data->display_name} ({$manager->data->user_email})</li>";
                }
            ?>
                        </ul>
                    </div>
                </div>
    <?php
        }
    }

    /**
     * Data to be passed to the client
     */
    public function pageProps(): array
    {
        return array_merge(
            [
                'page' => $this->slug(),
                'url' => $this->main->url(),
                'notice_visible' => boolval(get_option('codewpai_notice_visible', 1)),
            ],
            $this->globalData(),
            $this->data(),
        );
    }

    public function registerPageProps()
    {
        wp_localize_script($this->slug('-'), $this->main::SLUG.'Data', $this->pageProps());
    }

    public function globalData()
    {
        $current_user_data = wp_get_current_user()->data;

        $current_user = [
            'ID' => $current_user_data->ID,
            'user_email' => $current_user_data->user_email,
            'user_login' => $current_user_data->user_login,
            'user_nicename' => $current_user_data->user_nicename,
            'display_name' => $current_user_data->display_name,
            'avatar_url' => get_avatar_url($current_user_data->ID),
            'roles' => wp_get_current_user()->roles,
        ];

        $access_token = $this->main->getAccessToken();

        return [
            'nonce' => wp_create_nonce(Main::nonce()),
            'wp_rest_nonce' => wp_create_nonce('wp_rest'),
            'rest_route' => rest_url(),
            'rest_endpoint' => AwpRestRoute::REST_ROUTE_ENDPOINT,
            'home_url' => home_url(),
            'admin_route' => admin_url(),
            'plugin_url' => $this->main->pluginUrl,
            'settings_page' => $this->main->settingsPageUrl,
            'is_admin' => $this->main->auth->isAdmin(),
            'onboarding_completed' => $access_token ? $this->main->settings->onboarding_completed : false,
            'is_connected' => (bool) $access_token,
            'site_id' => $this->main->siteId(),
            'user' => $current_user,
            'api_host' => $this->main->apiClientHost(),
            'account' => $this->main->client()->user(),
            'account_settings' => $this->main->accountSettings()->get(),
            'general_settings' => $this->main->settings->getGeneralSettings(),
            'agentwp_manager' => $access_token ? $this->main->auth->isManager() : false,
            'agentwp_users_manager' => $access_token ? $this->main->auth->canManageUsers() : false,
            'agentwp_access' => $access_token ? $this->main->auth->hasAccess() : false,
        ];
    }

    public function registerControllers()
    {
        // Check the nonce for security
        check_ajax_referer('my-plugin-ajax-nonce', 'nonce');

        // Perform your AJAX action here
        $response = ['success' => true, 'message' => 'AJAX request successful'];

        // Return the response
        wp_send_json_success($response);
    }
}
