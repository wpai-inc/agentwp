<?php
/**
 * Add code snippet to the site.
 * 
 * @package AgentWP
 */

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Modules\CodeSnippets\SnippetHandler;

/**
 * Get code snippet plugin controller.
 */
class AddCodeSnippet extends BaseController
{
    protected string $method = 'POST';

    public function add_snippet()
    {
        $this->verifyNonce();
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $params = json_decode( $this->request->getContent(), true );
        if (! $params) {
            $this->error('Invalid request');
        }

        if (! $params['code']) {
            $this->error('Code snippet is required');
        }

        $snippet = new SnippetHandler();
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
