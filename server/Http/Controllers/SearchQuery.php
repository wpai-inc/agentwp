<?php

/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Services\HybridSearch;

/**
 * Get code snippet plugin controller.
 */
class SearchQuery extends BaseController
{
    protected string $method = 'GET';

    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
    ];

    public function __invoke()
    {
        $q = $this->request->get('query');

        $hybrid = new HybridSearch($q);

        $searchRes = $this->main->client()->search([
            'query' => $q,
            'wpResults' => $hybrid->searchWp(),
        ]);

        print_r($searchRes);
        exit();
        if (isset($searchRes['error'])) {
            $this->error($searchRes['error']);
        } else {
            $hybrid->setRemoteResults($searchRes);
            $finalResponse = [
                'total' => $hybrid->getTotal(),
                'results' => $hybrid->getResults(),
            ];

            if ($hybrid->hasResults()) {
                $summarizeRes = $this->main->client()->searchSummarize(
                    $hybrid->getQueryId(),
                    $hybrid->getSummaryResults()
                );

                if ($summarizeRes['summary']) {
                    $finalResponse['summary'] = $summarizeRes['summary'];
                }
            } else {
                $finalResponse['summary'] = <<<EOT
                The query for "$q" returned no results, indicating that there are no entries or relevant data associated with that term.
                EOT;
            }

            return $finalResponse;
        }
    }
}
