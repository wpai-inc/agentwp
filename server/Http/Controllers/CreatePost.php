<?php
/**
 * Add code snippet to the site.
 */

namespace WpAi\AgentWp\Http\Controllers;

/**
 * Get code snippet plugin controller.
 */
class CreatePost extends BaseController
{
    protected string $method = 'POST';

    public function __invoke()
    {
        $postContent = $this->getContent('post');

        if (! $postContent) {
            $this->error('invalid_request');
        }

        $postArr = [
            'post_author' => $this->main->auth->wpUserId(),
            'post_content' => $postContent,
            'post_status' => 'draft',
        ];

        $result = wp_insert_post($postArr, true);

        if (is_wp_error($result)) {
            $this->error('api_request_error');
        }

        $postUrl = get_edit_post_link($result);
        $this->respond(['url' => $postUrl]);
    }
}
