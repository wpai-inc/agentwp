<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Controllers\DisconnectSite;
use WpAi\AgentWp\Controllers\GenerateUniqueVerificationKey;
use WpAi\AgentWp\Controllers\GetUsers;
use WpAi\AgentWp\Controllers\Logout;
use WpAi\AgentWp\Controllers\MakeOnboardingAsCompleted;
use WpAi\AgentWp\Controllers\ManuallyActivateAgent;
use WpAi\AgentWp\Controllers\QueryActionController;
use WpAi\AgentWp\Controllers\SaveConnection;
use WpAi\AgentWp\Controllers\TestResponse;
use WpAi\AgentWp\Controllers\UpdateUserCapabilities;
use WpAi\AgentWp\Controllers\UsersManagement;
use WpAi\AgentWp\Controllers\ValidateWebsite;

class Router implements Registrable
{
    const REST_ROUTE_ENDPOINT = 'agentwp/v1';

    protected array $routes = [
        'test_route'                               => [TestResponse::class, 'test_response'],
        'run_action_query'                         => [QueryActionController::class, 'query'],
        'agentwp_users'                            => [GetUsers::class, 'get_users'],
        'update_user_capabilities'                 => [UpdateUserCapabilities::class, 'update_user_capabilities'],
        'onboarding_completed'                     => [MakeOnboardingAsCompleted::class, 'onboarding_completed'],
        'agentwp_generate_unique_verification_key' => [GenerateUniqueVerificationKey::class, 'generate_unique_verification_key'],
        'agentwp_validate_website'                 => [ValidateWebsite::class, 'validate_website'],
        'agentwp_save_connection'                  => [SaveConnection::class, 'save_connection'],
        'agentwp_logout'                           => [Logout::class, 'logout'],
        'agentwp_disconnect_site'                  => [DisconnectSite::class, 'disconnect_site'],
        'agentwp_manual_activation'                => [ManuallyActivateAgent::class, 'activate'],
    ];

    public function __construct(private Main $main)
    {
    }

    public function register(): void
    {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes(): void
    {
        foreach ($this->routes as $route => $callback) {
            $controller = new $callback[0]($this->main);
            register_rest_route(self::REST_ROUTE_ENDPOINT, '/'.$route, [
                'methods'             => $controller->method(),
                'callback'            => [$controller, $callback[1]],
                'permission_callback' => [$controller, 'check_permission'],
            ]);
        }
    }
}
