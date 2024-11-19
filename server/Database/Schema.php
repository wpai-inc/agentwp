<?php

namespace WpAi\AgentWp\Database;

/**
 * Schema is responsible for provisioning the database schema.
 */
class Schema
{
    private string $namespace = 'agentwp_';

    private array $tables = [
        'code' => [
            'id' => 'INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY',
            'code_id' => 'VARCHAR(36) NOT NULL',
            'path' => 'VARCHAR(255) NOT NULL',
            'params' => 'TEXT',
            'mode' => 'VARCHAR(255) NOT NULL',
            'active' => 'TINYINT(1) UNSIGNED NOT NULL DEFAULT 1',
            'stale' => 'TINYINT(1) UNSIGNED NOT NULL DEFAULT 0',
            'error' => 'TINYINT(1) UNSIGNED NOT NULL DEFAULT 0',
            'status' => 'VARCHAR(255) NOT NULL DEFAULT "idle"',
            'created_at' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        ],
        'errors' => [
            'id' => 'INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY',
            'code_id' => 'VARCHAR(36) NOT NULL',
            'message' => 'TEXT',
            'file' => 'VARCHAR(255)',
            'line' => 'INT(11)',
            'trace' => 'TEXT',
            'created_at' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        ],
    ];

    public function createTables()
    {
        global $wpdb;

        foreach ($this->tables as $table => $columns) {
            $table = $this->namespace.$table;
            $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}{$table} (";

            foreach ($columns as $column => $definition) {
                $sql .= "{$column} {$definition},";
            }

            $sql = rtrim($sql, ',');
            $sql .= ')';

            require_once ABSPATH.'wp-admin/includes/upgrade.php';
            dbDelta($sql);
        }
    }
}
