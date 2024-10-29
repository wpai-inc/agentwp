<?php

namespace WpAi\AgentWp\Client;

use WpAi\AgentWp\Contracts\ClientAppInterface;
use WpAi\AgentWp\Contracts\ClientSetupLocationInterface;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\Vite\Vite;
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

    protected function onLocations(): void {}

    public function setLocation(): void
    {
        $this->onLocations();

        foreach ($this->locations as $location) {
            if (! class_exists($location)) {
                // Translators: %1$s is the location class name
                throw new \Error(esc_html(sprintf(__('Location class does not exist: %1$s', 'agentwp'), $location)));
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
            $this->location->root();

            if (\method_exists($this->location, 'setup')) {
                $this->location->setup();
            } else {
                $this->setup();
            }
        }
    }

    public function setPageName(string $name): self
    {
        $this->pageName = $name;

        return $this;
    }

    public function setup(): void
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_client_assets']);
        add_action('admin_enqueue_scripts', [$this, 'registerPageProps']);
        add_filter('admin_body_class', [$this, 'bodyClass']);
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
        (new Vite)->enqueue_asset(
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
                    // Translators: This message is shown when JavaScript is disabled
                    esc_html_e(
                        'Warning: AgentWP will not work properly without JavaScript, please enable it.',
                        'agentwp'
                    );
            ?>
                </div>
            </noscript>
            <div id="<?php echo esc_attr($this->slug()) ?>"></div>
        <?php
        } else {
            $user_settings = $this->main->client()->user();
            $isOwner = $user_settings['user']['email'] === wp_get_current_user()->user_email;
            $managers = $this->main->auth->managers();
            ?>
            <div>
                <h1>AgentWP</h1>
                <div>
                    <?php if ($isOwner) { ?>
                        <p>
                            <?php
                                // Translators: This message is shown when the user does not have permission to access AgentWP
                                esc_html_e(
                                    'It looks like you have lost your AgentWP manager capabilities. Click the button below to restore your access.',
                                    'agentwp'
                                );
                        ?>
                        </p>
                        <div style="margin-top: 10px;">
                        <button class="button button-primary" id="make-me-a-manager">Restore Manager Access</button>
                        </div>
                        <script>
                            document.getElementById('make-me-a-manager').addEventListener('click', function () {
                                fetch('<?php echo esc_url(rest_url('agentwp/v1/make-me-a-manager')); ?>', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-WP-Nonce': '<?php echo esc_attr(wp_create_nonce('wp_rest')); ?>',
                                    },
                                }).then(function (response) {
                                    return response.json();
                                }).then(function (responseData) {
                                    if (responseData.success) {
                                        window.location.reload();
                                    }
                                }).catch(function (error) {
                                    console.error('Error:', error);
                                });
                            });
                        </script>

                    <?php } else { ?>
                    <p>
                        <?php
                            // Translators: This message is shown when the user does not have permission to access AgentWP
                            esc_html_e(
                                'You do not have permission to access AgentWP. Please request access to AgentWP from your AgentWP manager.',
                                'agentwp'
                            );
                        ?>
                    </p>
                    <div>
                        <strong>AgentWP Managers:</strong>
                        <ul>
                        <?php
                            if (count($managers) > 0) {
                                foreach ($managers as $manager) {
                                    ?><li><?php
                                        echo esc_html($manager->data->display_name.' ('.$manager->data->user_email.')');
                                    ?></li><?php
                                }
                            } else { ?>
                            <li>
                                <?php echo esc_html($user_settings['user']['name'].' ('.$user_settings['user']['email'].')'); ?>
                            </li>
                        <?php } ?>
                        </ul>
                    </div>
                    <?php } ?>
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
            'account_settings' => $this->main->accountSettings()->get(),
            'general_settings' => $this->main->settings->getGeneralSettings(),
            'agentwp_manager' => $access_token ? $this->main->auth->isManager() : false,
            'agentwp_users_manager' => $access_token ? $this->main->auth->canManageUsers() : false,
            'agentwp_access' => $access_token ? $this->main->auth->hasAccess() : false,
        ];
    }
}
