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

    protected Main $main;

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
        ?>
        <noscript>
            <div class="no-js">
                <?php
                        echo esc_html__(
                            'Warning: Agent WP will not work properly without JavaScript, please enable it.',
                            'agentwp'
                        );
        ?>
            </div>
        </noscript>
        <div id="<?php echo $this->slug() ?>"></div>
<?php
    }

    public function pageProps(): array
    {
        $merge = $this->data();

        return [
            'page' => $this->slug(),
            'url' => $this->main->url(),
            'notice_visible' => boolval(get_option('codewpai_notice_visible', 1)),
            ...$merge,
        ];
    }

    public function registerPageProps()
    {
        wp_localize_script($this->slug('-'), $this->slug('_'), $this->pageProps());
        wp_localize_script($this->slug('-'), 'agentwp_settings', $this->pageData());
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

        return [
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
            'client_id' => $this->main->settings->client_id,
            'api_host' => $this->main->apiClientHost(),
            'user' => $current_user,
            'onboarding_completed' => $this->main->settings->onboarding_completed,
            'account_settings' => $this->main->accountSettings()->get(),
            'general_settings' => $this->main->settings->getGeneralSettings(),
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
