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

    public function __invoke()
    {
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $plugin = (new SnippetHandler)->activeSnippetPlugin;
        $plugin = $plugin ? $plugin->name : '';

        $this->respond($plugin);
    }
}
