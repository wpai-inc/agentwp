<?php
/**
 * Snippet handler class for WPCode plugin.
 *
 * @package AgentWP
 */

namespace WpAi\AgentWp\Modules\CodeSnippets\Plugins;

use Exception;
use WpAi\AgentWp\Modules\CodeSnippets\SnippetInterface;

/**
 * WPCode snippet handler class.
 */
class WoodySnippets implements SnippetInterface
{
    /**
     * Plugin name.
     *
     * @var string
     */
    public string $name = 'WoodySnippets';

    /**
     * Check if WPCode plugin is active.
     *
     * @return bool
     */
    public static function isActive(): bool
    {
        return class_exists('WINP_Plugin');
    }

    /**
     * Get the plugin name.
     *
     * @return string
     */
    public function name(): string
    {
        return $this->name;
    }

    /**
     * Add a new snippet.
     *
     * @param  string  $code  The snippet code.
     * @param  string|null  $title  The snippet title.
     * @param  string|null  $description  The snippet description.
     * @param  string|null  $lang  The snippet language.
     * @param  string|null  $scope  The snippet scope.
     * @param  int|null  $priority  The snippet priority.
     * @return string The snippet URL.
     *
     * @throws Exception If the snippet could not be added.
     */
    public function add(string $code, ?string $title = null, ?string $description = null, ?string $lang = null, ?string $scope = null, ?int $priority = null): string
    {
        $data = [
            'post_title' => $title,
            'post_content' => $code,
            'post_status' => 'publish',
            'post_type' => 'wbcr-snippets',
            'meta_input' => [
                'snippet_description' => $description,
                'snippet_type' => $lang,
                'snippet_scope' => $scope,
                'snippet_priority' => $priority,
                'snippet_activate' => 0,
            ],
        ];

        $post_id = wp_insert_post($data);
        if (! $post_id || is_wp_error($post_id)) {
            throw new Exception('Failed to add Woody Snippets snippet: '.esc_html($post_id->get_error_message()));
        }

        return esc_url(admin_url('post.php?post='.$post_id.'&action=edit'));
    }
}
