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

    public function __invoke()
    {
        $this->verifyNonce();
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $indexer = (new \WpAi\AgentWp\Registry\IndexSiteDocs($this->main));
        $indexer->start();
    }
}
