<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\MiddlewareInterface;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Http\Controllers\AddCodeSnippet;
use WpAi\AgentWp\Http\Controllers\AwpApi;
use WpAi\AgentWp\Http\Controllers\CreatePost;
use WpAi\AgentWp\Http\Controllers\DisconnectSite;
use WpAi\AgentWp\Http\Controllers\GetCodeSnippetPlugin;
use WpAi\AgentWp\Http\Controllers\GetMentionItems;
use WpAi\AgentWp\Http\Controllers\GetUsers;
use WpAi\AgentWp\Http\Controllers\IndexSiteDocs;
use WpAi\AgentWp\Http\Controllers\Logout;
use WpAi\AgentWp\Http\Controllers\MakeMeAManager;
use WpAi\AgentWp\Http\Controllers\MakeOnboardingAsCompleted;
use WpAi\AgentWp\Http\Controllers\ManuallyActivateAgent;
use WpAi\AgentWp\Http\Controllers\OauthAuthorize;
use WpAi\AgentWp\Http\Controllers\OauthConnect;
use WpAi\AgentWp\Http\Controllers\QueryActionController;
use WpAi\AgentWp\Http\Controllers\RefreshToken;
use WpAi\AgentWp\Http\Controllers\SaveConnection;
use WpAi\AgentWp\Http\Controllers\SearchQuery;
use WpAi\AgentWp\Http\Controllers\SiteDataController;
use WpAi\AgentWp\Http\Controllers\TestAuthResponse;
use WpAi\AgentWp\Http\Controllers\TestResponse;
use WpAi\AgentWp\Http\Controllers\Tools;
use WpAi\AgentWp\Http\Controllers\UpdateGeneralSettings;
use WpAi\AgentWp\Http\Controllers\UpdateUserCapabilities;
use WpAi\AgentWp\Http\Controllers\UserController;
use WpAi\AgentWp\Http\Controllers\ValidateWebsite;
use WpAi\AgentWp\Http\Middleware\CheckRestRequestNonce;
use WpAi\AgentWp\Main;

class Router implements Registrable
{
    const REST_ROUTE_ENDPOINT = 'agentwp/v1';

    protected array $routes = [
        'api' => AwpApi::class,
        'create_request' => [AwpApi::class, 'createRequest'],
        'retry_request' => [AwpApi::class, 'retryRequest'],
        'test_auth' => TestAuthResponse::class,
        'test_route' => [TestResponse::class, 'successfulResponse'],
        'test_stream_forward' => [TestResponse::class, 'stream'],
        'accept_terms' => [UserController::class, 'acceptTerms'],
        'agentwp_users' => GetUsers::class,
        'site_data' => SiteDataController::class,
        'update_user' => UpdateUserCapabilities::class,
        'onboarding_completed' => MakeOnboardingAsCompleted::class,
        'validate_website' => ValidateWebsite::class,
        'save_connection' => SaveConnection::class,
        'logout' => Logout::class,
        'manual_activation' => ManuallyActivateAgent::class,
        'refresh_token' => RefreshToken::class,
        'update_general_settings' => UpdateGeneralSettings::class,
        'code_snippet_plugin' => GetCodeSnippetPlugin::class,
        'add_snippet' => AddCodeSnippet::class,
        'create_post' => CreatePost::class,
        'mention_items' => GetMentionItems::class,
        'disconnect_site' => DisconnectSite::class,
        'run_action_query' => QueryActionController::class,
        'index_site_docs' => IndexSiteDocs::class,
        'search_query' => SearchQuery::class,
        'oauth_authorize' => OauthAuthorize::class,
        'oauth_connect' => OauthConnect::class,
        'tools_summarize' => [Tools::class, 'summarize'],
        'make-me-a-manager' => MakeMeAManager::class,
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
        $default_middleware = [CheckRestRequestNonce::class];
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
                'callback' => function (\WP_REST_Request $request) use ($controller, $callback, $default_middleware) {
                    // Only include nonce middleware if disable_nonce is not true
                    $middlewares = empty($controller->disable_nonce) || $controller->disable_nonce === false
                        ? array_merge($default_middleware, $controller->middleware)
                        : $controller->middleware;

                    // Run middleware checks before the controller action
                    foreach ($middlewares as $middlewareClass) {
                        $middleware = new $middlewareClass($this->main);

                        if ($middleware instanceof MiddlewareInterface) {
                            $result = $middleware->handle($request);

                            if (is_wp_error($result)) {
                                return $result;
                            }
                        }
                    }

                    return call_user_func($callback, $request);
                },
                'permission_callback' => [$controller, 'check_permission'],
            ]);
        }
    }
}
