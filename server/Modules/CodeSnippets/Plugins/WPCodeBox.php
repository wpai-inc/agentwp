<?php
/**
 * Snippet handler class for WPCodeBox plugin.
 */

namespace WpAi\AgentWp\Modules\CodeSnippets\Plugins;

use Exception;
use WpAi\AgentWp\Modules\CodeSnippets\SnippetInterface;
use wpdb;

/**
 * WPCodeBox snippet handler class.
 */
class WPCodeBox implements SnippetInterface
{
    /**
     * Plugin name.
     */
    public string $name = 'WPCodeBox';

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
        $this->table_name = $wpdb->prefix.'wpcb_snippets';
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
        return class_exists('WPCodeBox');
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
            'title' => $title,
            'description' => $description,
            'enabled' => 0, // Deactivated state
            'priority' => $priority,
            'runType' => 'always',
            'code' => $code,
            'original_code' => $code,
            'codeType' => $lang,
            'conditions' => '[]',
            'location' => $scope,
            'tagOptions' => '[]',
            'hook' => wp_json_encode([
                [
                    'hook' => [
                        'label' => 'Plugins Loaded (Default)',
                        'value' => 'custom_plugins_loaded',
                    ],
                    'priority' => $priority,
                ],
            ]),
            'renderType' => 'inline',
            'minify' => 0,
            'snippet_order' => -1,
            'addToQuickActions' => 0,
            'savedToCloud' => 0,
            'remoteId' => 0,
            'externalUrl' => 0,
            'secret' => wp_generate_password(40, false),
            'folderId' => 0,
            'error' => 0,
            'errorMessage' => '',
            'errorTrace' => '',
            'errorLine' => 0,
            'devMode' => 0,
            'lastModified' => time(),
        ];

        $result = $this->wpdb->insert($this->table_name, $data);
        if ($result === false) {
            // Translators: %1$s is the error message returned by the database.
            throw new Exception(esc_html(sprintf(__('Failed to add WPCodeBox snippet: %1$s', 'agentwp'), $this->wpdb->last_error)));
        }

        return admin_url(sprintf('admin.php?page=wpcb_snippets&snippet_id=%d', absint($this->wpdb->insert_id)));
    }
}
