<?php
/**
 * Get code snippet plugin controller.
 */

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Modules\CodeSnippets\SnippetHandler;

/**
 * Get code snippet plugin controller.
 */
class GetCodeSnippetPlugin extends BaseController
{
    protected string $method = 'GET';

    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
    ];

    public function __invoke()
    {
        $plugin = (new SnippetHandler)->activeSnippetPlugin;
        $plugin = $plugin ? $plugin->name : '';

        $this->respond($plugin);
    }
}
