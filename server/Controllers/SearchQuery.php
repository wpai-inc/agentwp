<?php

/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\HybridSearch;

/**
 * Get code snippet plugin controller.
 */
class SearchQuery extends BaseController
{
    protected string $method = 'GET';

    public function __invoke()
    {
        $this->verifyNonce();
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $q = $this->request->get('query');

        $hybrid = new HybridSearch($q);

        $searchRes = $this->main->client()->searchQuery([
            'query' => $q,
            'wpResults' => $hybrid->searchWp(),
        ]);

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
