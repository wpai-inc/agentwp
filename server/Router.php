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
use WpAi\AgentWp\Controllers\RefreshToken;
use WpAi\AgentWp\Controllers\SaveConnection;
use WpAi\AgentWp\Controllers\TestResponse;
use WpAi\AgentWp\Controllers\UpdateUserCapabilities;
use WpAi\AgentWp\Controllers\ValidateWebsite;

class Router implements Registrable
{
    const REST_ROUTE_ENDPOINT = 'agentwp/v1';

    protected array $routes = [
        'test_route' => [TestResponse::class, 'test_response'],
        'run_action_query' => [QueryActionController::class, 'query'],
        'agentwp_users' => [GetUsers::class, 'get_users'],
        'update_user' => [UpdateUserCapabilities::class, 'update_user_capabilities'],
        'onboarding_completed' => [MakeOnboardingAsCompleted::class, 'onboarding_completed'],
        'get_unique_verification_key' => [GenerateUniqueVerificationKey::class, 'generate_unique_verification_key'],
        'validate_website' => [ValidateWebsite::class, 'validate_website'],
        'save_connection' => [SaveConnection::class, 'save_connection'],
        'logout' => [Logout::class, 'logout'],
        'disconnect_site' => [DisconnectSite::class, 'disconnect_site'],
        'manual_activation' => [ManuallyActivateAgent::class, 'activate'],
        'refresh_token' => [RefreshToken::class, 'refresh'],
    ];

    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register(): void
    {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes(): void
    {
        foreach ($this->routes as $route => $callback) {
            $controller = new $callback[0]($this->main);
            register_rest_route(self::REST_ROUTE_ENDPOINT, '/' . $route, [
                'methods' => $controller->method(),
                'callback' => [$controller, $callback[1]],
                'permission_callback' => [$controller, 'check_permission'],
            ]);
        }
    }
}
