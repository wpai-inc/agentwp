<?php
/**
 * Get code snippet plugin controller.
 */

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Modules\CodeSnippets\SnippetHandler;

/**
 * Get code snippet plugin controller.
 */
class GetCodeSnippetPlugin extends BaseController
{
    protected string $method = 'GET';

    protected array $middleware = [
        'check_site_connection',
    ];

    public function __invoke()
    {
        $plugin = (new SnippetHandler)->activeSnippetPlugin;
        $plugin = $plugin ? $plugin->name : '';

        $this->respond($plugin);
    }
}
