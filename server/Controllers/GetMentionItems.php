<?php

/**
 * Get reference items controller.
 * 
 * @package AgentWP
 */

namespace WpAi\AgentWp\Controllers;

/**
 * Get code snippet plugin controller.
 */
class GetMentionItems extends BaseController
{
    protected string $method = 'GET';

    public function __invoke()
    {
        $this->verifyNonce();
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $keyword = $this->request->query->get('keyword');
        $keyword = sanitize_text_field($keyword);
        $keyword = str_ireplace('@', '', $keyword);

        $post_types = get_post_types(['public' => true]);
        unset($post_types['attachment']);

        $data = [];
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
            if (!empty($posts)) {
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

        if (!empty($keyword)) {
            $args['search'] = '*' . esc_attr($keyword) . '*';
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

        if (!empty($usrs)) {
            $data['users'] = [
                'title' => 'Users',
                'items' => $usrs,
            ];
        }

        $this->respond($data);
    }
}
