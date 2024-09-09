<?php

/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Controllers;

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
        $searchRes = $this->main->client()->searchQuery([
            'query' => $q,
            'wpResults' => [],
        ]);

        if (isset($searchRes['error'])) {
            $this->error($searchRes['error']);
        } else {
            $hydratedResults = $this->hydrateResults($searchRes['results']);
            $finalResponse = [
                'total' => $searchRes['total'],
                'results' => $hydratedResults,
            ];

            if( count($hydratedResults) > 0 ) {
                $summarizeRes = $this->main->client()->searchSummarize(
                    $searchRes['query']['id'],
                    [
                        'totalResults' => $searchRes['total'],
                        'results' => array_map(function ($r) {
                            return [
                                'object' => [
                                    'type' => $r->type,
                                    'id' => $r->id,
                                ],
                                'excerpt' => $r->excerpt,
                            ];
                        }, $hydratedResults),
                    ]);
    
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

    private function hydrateResults(array $results): array
    {
        return array_filter(array_map(function ($result) {
            switch ($result['type']) {
                case 'posts':
                    return $this->getResultFromPost($result['id'], $result['score']);
                default:
                    return null;
            }
        }, $results), function ($i) {
            return $i !== null;
        });
    }

    private function getResultFromPost(int $postId, float $score): SearchResult
    {
        $post = get_post($postId);
        $excerpt = get_the_excerpt($postId);
        $title = get_the_title($postId);

        return new SearchResult(
            'posts',
            $postId,
            $title,
            get_permalink($postId),
            get_the_date('Y-m-d', $postId),
            $score,
            ! empty($excerpt) ? $excerpt : $title,
            get_the_author_meta('display_name', $post->post_author),
            get_the_post_thumbnail_url($postId),
        );
    }
}

class SearchResult
{
    public string $type;

    public int $id;

    public string $title;

    public ?string $excerpt;

    public string $url;

    public ?string $author;

    public string $date;

    public ?string $thumbnail;

    public float $score;

    public function __construct(
        string $type,
        int $id,
        string $title,
        string $url,
        string $date,
        float $score,
        ?string $excerpt = null,
        ?string $author = null,
        ?string $thumbnail = null
    ) {
        $this->type = $type;
        $this->id = $id;
        $this->title = $title;
        $this->url = $url;
        $this->date = $date;
        $this->score = $score;
        $this->excerpt = $excerpt;
        $this->author = $author;
        $this->thumbnail = $thumbnail;
    }
}
