<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Controllers\AddCodeSnippet;
use WpAi\AgentWp\Controllers\DisconnectSite;
use WpAi\AgentWp\Controllers\GenerateUniqueVerificationKey;
use WpAi\AgentWp\Controllers\GetCodeSnippetPlugin;
use WpAi\AgentWp\Controllers\GetMentionItems;
use WpAi\AgentWp\Controllers\GetUsers;
use WpAi\AgentWp\Controllers\Logout;
use WpAi\AgentWp\Controllers\MakeOnboardingAsCompleted;
use WpAi\AgentWp\Controllers\ManuallyActivateAgent;
use WpAi\AgentWp\Controllers\QueryActionController;
use WpAi\AgentWp\Controllers\RefreshToken;
use WpAi\AgentWp\Controllers\SaveConnection;
use WpAi\AgentWp\Controllers\SiteDataController;
use WpAi\AgentWp\Controllers\TestResponse;
use WpAi\AgentWp\Controllers\UpdateGeneralSettings;
use WpAi\AgentWp\Controllers\UpdateUserCapabilities;
use WpAi\AgentWp\Controllers\ValidateWebsite;
use WpAi\AgentWp\Main;

class Router implements Registrable
{
    const REST_ROUTE_ENDPOINT = 'agentwp/v1';

    protected array $routes = [
        'test_route' => [
            TestResponse::class,
            'successfulResponse',
        ],
        'test_stream_forward' => [
            TestResponse::class,
            'stream',
        ],
        'test_auth' => \WpAi\AgentWp\Controllers\TestAuthResponse::class,
        'agentwp_users' => GetUsers::class,
        'site_data' => SiteDataController::class,
        'update_user' => UpdateUserCapabilities::class,
        'onboarding_completed' => MakeOnboardingAsCompleted::class,
        'get_unique_verification_key' => GenerateUniqueVerificationKey::class,
        'validate_website' => ValidateWebsite::class,
        'save_connection' => SaveConnection::class,
        'logout' => Logout::class,
        'manual_activation' => ManuallyActivateAgent::class,
        'refresh_token' => RefreshToken::class,
        'update_general_settings' => UpdateGeneralSettings::class,
        'code_snippet_plugin' => GetCodeSnippetPlugin::class,
        'add_snippet' => AddCodeSnippet::class,
        'mention_items' => GetMentionItems::class,
        'disconnect_site' => DisconnectSite::class,
        'run_action_query' => QueryActionController::class,
        'index_site_docs' => \WpAi\AgentWp\Controllers\IndexSiteDocs::class,
        'search_query' => \WpAi\AgentWp\Controllers\SearchQuery::class,
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
            if (is_string($callback)) {
                $controller = new $callback($this->main);
                $callback = [$controller, '__invoke'];
            } else {
                $controller = new $callback[0]($this->main);
                $callback = [$controller, $callback[1]];
            }

            register_rest_route(self::REST_ROUTE_ENDPOINT, '/'.$route, [
                'methods' => $controller->method(),
                'callback' => $callback,
                'permission_callback' => [$controller, 'check_permission'],
            ]);
        }
    }
}
