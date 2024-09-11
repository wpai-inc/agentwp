<?php

/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Http\Controllers;

/**
 * Get code snippet plugin controller.
 */
class IndexSiteDocs extends BaseController
{
    protected string $method = 'POST';

    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
    ];

    public function __invoke()
    {
        $indexer = (new \WpAi\AgentWp\Registry\IndexSiteDocs($this->main));
        $indexer->start();
    }
}
