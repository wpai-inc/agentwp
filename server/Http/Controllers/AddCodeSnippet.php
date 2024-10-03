<?php
/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Modules\CodeSnippets\SnippetHandler;

/**
 * Get code snippet plugin controller.
 */
class AddCodeSnippet extends BaseController
{
    protected string $method = 'POST';

    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
    ];

    public function __invoke()
    {
        $params = $this->request->getJsonContent();
        if (! $params) {
            $this->error('Invalid request');
        }

        if (! $params['code']) {
            $this->error('Code snippet is required');
        }

        $snippet = new SnippetHandler;
        if (! $snippet->activeSnippetPlugin) {
            $this->error('No active snippet plugin found');
        }

        $data = [
            'title' => $params['title'],
            'description' => $params['description'],
            'code' => $params['code'],
            'lang' => $params['lang'],
        ];

        try {
            $url = $snippet->addSnippet($data);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }

        $this->respond($url);
    }
}
