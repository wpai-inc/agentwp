<?php
/**
 * Snippet handler class interface.
 * 
 * @package AgentWP
 */

namespace WpAi\AgentWp\Modules\CodeSnippets;

/**
 * Snippet handler class interface.
 */
interface SnippetInterface
{
    /**
     * Plugin name.
     */
    public function name(): string;

    /**
     * Check if the plugin is active.
     *
     * @return bool
     */
    public static function isActive(): bool;

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
    public function add(string $code, ?string $title, ?string $description, ?string $lang, ?string $scope, ?int $priority): string;
}