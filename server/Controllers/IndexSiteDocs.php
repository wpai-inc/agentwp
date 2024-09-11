<?php

/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Controllers;

/**
 * Get code snippet plugin controller.
 */
class IndexSiteDocs extends BaseController
{
    protected string $method = 'POST';

    protected array $middleware = [
        'check_site_connection',
    ];

    public function __invoke()
    {
        $indexer = (new \WpAi\AgentWp\Registry\IndexSiteDocs($this->main));
        $indexer->start();
    }
}
