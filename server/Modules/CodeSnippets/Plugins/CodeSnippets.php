<?php
/**
 * Snippet handler class for CodeSnippets plugin.
 */

namespace WpAi\AgentWp\Modules\CodeSnippets\Plugins;

use Exception;
use WpAi\AgentWp\Modules\CodeSnippets\SnippetInterface;
use wpdb;

/**
 * CodeSnippets snippet handler class.
 */
class CodeSnippets implements SnippetInterface
{
    /**
     * Plugin name.
     */
    public string $name = 'CodeSnippets';

    /**
     * Table name.
     *
     * @var string
     */
    protected $table_name;

    /**
     * WPDB instance.
     *
     * @var wpdb
     */
    protected $wpdb;

    /**
     * Setup the class.
     *
     * @return void
     */
    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_name = $wpdb->prefix.'snippets';
    }

    /**
     * Plugin name.
     */
    public function name(): string
    {
        return $this->name;
    }

    /**
     * Check if WPCode plugin is active.
     */
    public static function isActive(): bool
    {
        return class_exists('Code_Snippets\Plugin');
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
            'name' => $title,
            'description' => $description,
            'code' => $code,
            'tags' => '',
            'scope' => $scope,
            'priority' => $priority,
            'active' => 0,
            'modified' => current_time('mysql'),
            'revision' => 1,
        ];

        $result = $this->wpdb->insert($this->table_name, $data);
        if ($result === false) {
            // Translators: %1$s is the error message returned by the database.
            throw new Exception(esc_html(sprintf(__('Failed to add CodeSnippets snippet: %1$s', 'agentwp'), $this->wpdb->last_error)));
        }

        return admin_url('admin.php?page=edit-snippet&id='.$this->wpdb->insert_id);
    }
}
