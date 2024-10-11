<?php

/**
 * Get reference items controller.
 */

namespace WpAi\AgentWp\Http\Controllers;

/**
 * Get code snippet plugin controller.
 */
class GetMentionItems extends BaseController
{
    protected string $method = 'GET';

    public array $middleware = [
        \WpAi\AgentWp\Http\Middleware\CheckSiteConnection::class,
    ];

    public function __invoke()
    {
        $url = $this->request->getHeader('referer', null);
        $keyword = $this->request->get('keyword', true);
        $keyword = str_ireplace('@', '', $keyword);

        $post_types = get_post_types(['public' => true]);
        unset($post_types['attachment']);

        $data = [];
        if ('this' === $keyword) {
            $item = $this->getReferenceItem($url);
            if ($item) {
                $data['current_item'] = [
                    'title' => $item['type'] === 'user' ? 'Current User' : 'Current Item',
                    'items' => [$item],
                ];
            }
        }

        foreach ($post_types as $post_type) {
            $items = get_posts([
                'post_type' => $post_type,
                's' => $keyword,
                'posts_per_page' => 10,
                'orderby' => 'date',
                'order' => 'DESC',
            ]);

            $posts = [];
            foreach ($items as $item) {
                $posts[] = [
                    'id' => $item->ID,
                    'title' => $item->post_title,
                    'type' => $post_type,
                ];
            }

            $type = get_post_type_object($post_type);
            if (! empty($posts)) {
                $data[$post_type] = [
                    'title' => $type->labels->name,
                    'items' => $posts,
                ];
            }
        }

        $args = [
            'number' => 10,
            'orderby' => 'registered',
            'order' => 'DESC',
        ];

        if (! empty($keyword)) {
            $args['search'] = '*'.esc_attr($keyword).'*';
            $args['search_columns'] = ['user_login', 'user_nicename', 'user_email'];
            $args['meta_query'] = [
                'relation' => 'OR',
                [
                    'key' => 'first_name',
                    'value' => $keyword,
                    'compare' => 'LIKE',
                ],
                [
                    'key' => 'last_name',
                    'value' => $keyword,
                    'compare' => 'LIKE',
                ],
            ];
        }

        $users = new \WP_User_Query($args);
        $users = $users->get_results();

        $usrs = [];
        foreach ($users as $user) {
            $usrs[] = [
                'id' => $user->ID,
                'title' => $user->display_name,
                'type' => 'user',
            ];
        }

        if (! empty($usrs)) {
            $data['users'] = [
                'title' => 'Users',
                'items' => $usrs,
            ];
        }

        $this->respond($data);
    }

    /**
     * Get this reference item.
     * 
     * @param string $url Current URL.
     * @return ?array
     */
    public function getReferenceItem(string $url): ?array
    {
        if (strpos($url, 'profile.php')) {
            $user = get_user_by('id', get_current_user_id());
            return [
                'id' => $user->ID,
                'title' => $user->display_name,
                'type' => 'user',
            ];
        }

        $query = parse_url($url, PHP_URL_QUERY);
        $query = wp_parse_args($query);

        if (strpos($url, 'users.php') || strpos($url, 'user-edit.php')) {
            $user_id = isset($query['user_id']) ? $query['user_id'] : null;
            if (!$user_id) {
                $user_id = isset($query['id']) ? $query['id'] : null;
            }
            $user = get_user_by('id', $user_id);
            if (!$user) {
                return null;
            }

            return [
                'id' => $user->ID,
                'title' => $user->display_name,
                'type' => 'user',
            ];
        }

        if (strpos($url, 'post.php')) {
            $post_id = $query['post'] ?? null;
            $post = get_post($post_id);
            if (!$post) {
                return null;
            }

            return [
                'id' => $post->ID,
                'title' => $post->post_title,
                'type' => $post->post_type,
            ];
        }

        return null;
    }
}
