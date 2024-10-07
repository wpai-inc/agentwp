<?php

namespace WpAi\AgentWp\Services;

class HybridSearch
{
    private string $query;

    private ?string $queryId = null;

    private array $remoteResults = [];

    private int $totalResults = 0;

    private array $fields = [
        'posts' => [
            'id' => 'ID',
            'fields' => [
                'post_content',
                'post_title',
            ],
        ],
        'postmeta' => [
            'id' => 'meta_id',
            'fields' => [
                'meta_value',
                'meta_key',
            ],
        ],
        'comments' => [
            'id' => 'comment_ID',
            'fields' => [
                'comment_content',
            ],
        ],
    ];

    public function __construct(string $query)
    {
        $this->query = $query;
    }

    //     public function setRemoteResults(array $results): void
    //     {
    //         $this->queryId = $results['query']['id'];
    //         $this->totalResults = $results['total'];
    //         $this->remoteResults = $this->hydrateResults($results['results']);
    //     }

    //     public function getQueryId(): string
    //     {
    //         return $this->queryId;
    //     }

    //     public function getTotal(): int
    //     {
    //         return $this->totalResults;
    //     }

    //     public function getResults(): array
    //     {
    //         return $this->remoteResults;
    //     }

    //     public function hasResults(): bool
    //     {
    //         return count($this->remoteResults) > 0;
    //     }

    //     public function getSummaryResults(): array
    //     {
    //         return [
    //             'totalResults' => $this->totalResults,
    //             'results' => array_map(function ($result) {
    //                 return [
    //                     'object' => [
    //                         'type' => $result->type,
    //                         'id' => $result->id,
    //                     ],
    //                     'excerpt' => $result->excerpt,
    //                 ];
    //             }, $this->remoteResults),
    //         ];
    //     }

    //     public function searchWp(): array
    //     {
    //         global $wpdb;

    //         $results = [];
    //         foreach ($this->fields as $objectType => $select) {
    //             $table = $wpdb->prefix.$objectType;
    //             $sql = "SELECT {$select['id']} as id FROM $table WHERE ";

    //             $sql .= implode(' OR ', array_map(function ($field) {
    //                 return "$field LIKE '%$this->query%'";
    //             }, $select['fields']));

    //             $results = array_merge($results, array_map(function ($id) use ($objectType) {
    //                 return [
    //                     'type' => $objectType,
    //                     'id' => intval($id),
    //                 ];
    //             }, array_column(Db::getResults($sql, [], ARRAY_A), 'id')));
    //         }

    //         return $results;
    //     }

    //     private function hydrateResults(array $results): array
    //     {
    //         return array_filter(array_map(function ($result) {
    //             switch ($result['type']) {
    //                 case 'posts':
    //                     return $this->getResultFromPost($result['id'], $result['score']);
    //                 default:
    //                     return null;
    //             }
    //         }, $results), function ($i) {
    //             return $i !== null;
    //         });
    //     }

    //     private function getResultFromPost(int $postId, float $score): SearchResult
    //     {
    //         $post = get_post($postId);
    //         $excerpt = get_the_excerpt($postId);
    //         $title = get_the_title($postId);

    //         return new SearchResult(
    //             'posts',
    //             $postId,
    //             $title,
    //             get_permalink($postId),
    //             get_the_date('Y-m-d', $postId),
    //             $score,
    //             ! empty($excerpt) ? $excerpt : $title,
    //             get_the_author_meta('display_name', $post->post_author),
    //             get_the_post_thumbnail_url($postId),
    //         );
    //     }
    // }

    // class SearchResult
    // {
    //     public string $type;

    //     public int $id;

    //     public string $title;

    //     public ?string $excerpt;

    //     public string $url;

    //     public ?string $author;

    //     public string $date;

    //     public ?string $thumbnail;

    //     public float $score;

    //     public function __construct(
    //         string $type,
    //         int $id,
    //         string $title,
    //         string $url,
    //         string $date,
    //         float $score,
    //         ?string $excerpt = null,
    //         ?string $author = null,
    //         ?string $thumbnail = null
    //     ) {
    //         $this->type = $type;
    //         $this->id = $id;
    //         $this->title = $title;
    //         $this->url = $url;
    //         $this->date = $date;
    //         $this->score = $score;
    //         $this->excerpt = $excerpt;
    //         $this->author = $author;
    //         $this->thumbnail = $thumbnail;
    //     }
}
