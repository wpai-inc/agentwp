<?php
/**
 * Snippet handler class for WPCode plugin.
 * 
 * @package AgentWP
 */

namespace WpAi\AgentWp\Modules\CodeSnippets\Plugins;

use Exception;
use WpAi\AgentWp\Modules\CodeSnippets\SnippetInterface;

use WPCode_Snippet;

/**
 * WPCode snippet handler class.
 */
class WPCode implements SnippetInterface
{   
    /**
     * Plugin name.
     * 
     * @var string
     */
    public string $name = 'WPCode';

    /**
     * Check if WPCode plugin is active.
     *
     * @return bool
     */
    public static function isActive(): bool
    {
        return class_exists('WPCode');
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
     * @param string $code The snippet code.
     * @param string|null $title The snippet title.
     * @param string|null $description The snippet description.
     * @param string|null $lang The snippet language.
     * @param string|null $scope The snippet scope.
     * @param int|null $priority The snippet priority.
     * @return string The snippet URL.
     * @throws Exception If the snippet could not be added.
     */
    public function add(string $code, ?string $title = null, ?string $description = null, ?string $lang = null, ?string $scope = null, ?int $priority = null): string
    {
        $snippet = new WPCode_Snippet(
            [
                'title' => $title,
                'desc' => $description,
                'code' => $code,
                'code_type' => $lang,
                'location' => $scope,
                'priority' => $priority,
                'active' => false,
                'tags' => [],
                'use_php' => $lang === 'php',
            ]
        );

        $snippet_id = $snippet->save();
        if (!$snippet_id) {
            throw new Exception('Failed to add WPCode snippet.');
        }

        return admin_url('admin.php?page=wpcode-snippet-manager&snippet_id=' . $snippet_id);
    }
}