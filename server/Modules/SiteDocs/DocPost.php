<?php

namespace WpAi\AgentWp\Modules\SiteDocs;

use DateTime;

class DocPost extends Doc
{
    protected string $docType = 'post';

    protected ?int $total = null;

    protected array $schemas = [
        'comments_content',
        'meta_values',
        'posts_combined',
        'posts_simple',
        'posts_title',
    ];

    public function getTotal(): int
    {
        if (! $this->total) {
            $this->total = \wp_count_posts('post')->publish;
        }

        return $this->total;
    }

    public function getDocs(): array
    {
        $lastId = $this->status ? $this->status->last_doc_id_indexed : 0;
        $posts = $this->getPosts($this->batchAmount, $lastId);

        return array_map(function ($post) {
            return [
                'table' => 'posts',
                'id' => (int) $post->ID,
                'parent_id' => (int) $post->post_parent,
                'created_at' => (new DateTime($post->post_date))->format('Y-m-d\TH:i:sP'),
                'updated_at' => (new DateTime($post->post_modified))->format('Y-m-d\TH:i:sP'),
                'meta' => $this->getMeta(),
                'content' => $this->getContent($post),
                'schemas' => $this->getSchemas(),
            ];
        }, $posts);
    }

    public function getContent(object $post): array
    {
        return [
            'title' => apply_filters('the_title', $post->post_title),
            'content' => apply_filters('the_content', $post->post_content),
            'comments' => $this->getPostComments($post->ID),
            'meta' => $this->getPostMeta($post->ID),
        ];
    }

    public function getMeta(): array
    {
        return [];
    }

    private function getPosts($batch_amount, int $last_doc_id_indexed): array
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT p.ID, p.post_parent, p.post_date, p.post_modified, p.post_title, p.post_content
                FROM {$wpdb->posts} p
                WHERE p.post_type = %s AND p.post_status = %s
                AND p.ID > %d
                ORDER BY p.ID ASC
                LIMIT %d",
                [
                    'post',
                    'publish',
                    $last_doc_id_indexed,
                    $batch_amount,
                ]
            )
        );
    }

    private function getPostMeta(int $postId): array
    {
        global $wpdb;

        $meta = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT meta_id, meta_key, meta_value
                FROM {$wpdb->postmeta}
                WHERE post_id = %d",
                [$postId]
            )
        );

        return array_map(function ($meta) {
            return [
                'id' => (int) $meta->meta_id,
                'key' => $meta->meta_key,
                'value' => $meta->meta_value,
            ];
        }, $meta);
    }

    private function getPostComments(int $postId): array
    {
        global $wpdb;

        $comments = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT comment_ID, comment_content
                FROM {$wpdb->comments}
                WHERE comment_post_ID = %d",
                [$postId]
            )
        );

        return array_map(function ($comment) {
            return [
                'id' => (int) $comment->comment_ID,
                'text' => $comment->comment_content,
            ];
        }, $comments);
    }
}
