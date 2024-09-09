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
    protected string $method = 'POST';

    public function __invoke()
    {
        $this->verifyNonce();
        if (! $this->main->siteId()) {
            $this->error('You do not have permission to perform this action');
        }

        return [
            'total' => 3,
            'results' => [
                [
                    'title' => 'How to Create a Custom WordPress Theme',
                    'excerpt' => 'Learn how to create a custom WordPress theme from scratch.',
                    'url' => 'https://example.com/how-to-create-a-custom-wordpress-theme',
                    'date' => 'March 15, 2023',
                    'author' => 'John Doe',
                ],
                [
                    'title' => 'How to Create a Custom WordPress Theme',
                    'excerpt' => 'Learn how to create a custom WordPress theme from scratch.',
                    'url' => 'https://example.com/how-to-create-a-custom-wordpress-theme',
                    'date' => 'March 15, 2023',
                ],
                [
                    'title' => 'How to Create a Custom WordPress Theme',
                    'excerpt' => 'Learn how to create a custom WordPress theme from scratch.',
                    'url' => 'https://example.com/how-to-create-a-custom-wordpress-theme',
                    'date' => 'March 15, 2023',
                    'author' => 'John Doe',
                ],
            ],
        ];
    }
}
