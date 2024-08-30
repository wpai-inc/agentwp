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
class GetReferenceItems extends BaseController
{
    protected string $method = 'GET';

    public function reference_items()
    {
        $this->verifyNonce();
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        $keyword = $this->request->query->get('keyword');
        $keyword = sanitize_text_field($keyword);

        $post_types = get_post_types(['public' => true]);
        $data = [];
        foreach ($post_types as $post_type) {
            $items = get_posts([
                'post_type' => $post_type,
                's' => $keyword,
                'posts_per_page' => 10,
            ]);

            foreach ($items as $item) {
                $data[$post_type][] = [
                    'id' => $item->ID,
                    'title' => $item->post_title,
                    'type' => $post_type,
                ];
            }
        }

        $users = get_users([
            'search' => $keyword,
            'number' => 10,
        ]);

        foreach ($users as $user) {
            $data['user'][] = [
                'id' => $user->ID,
                'title' => $user->display_name,
                'type' => 'user',
            ];
        }

        $this->respond($data);
    }
}
