<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Factory\AwpClientFactory;

class SiteIndexer implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        add_action('init', [$this, 'indexSite']);
        add_filter('debug_information', [$this, 'add_plugin_slugs_to_debug_info']);
        add_filter('debug_information', [$this, 'add_db_schema_to_debug_info']);
    }

    /**
     * Temporary for demo, terrible performance.
     * Needs to run intermittently and check for hash changes before sending
     * Explore: transients or cron jobs
     */
    public function indexSite()
    {
        if ($siteId = $this->main->siteId()) {
            $debug_data = SiteData::getDebugData();
            $awpClient = AwpClientFactory::create($this->main);

            $response = $awpClient->indexSite($siteId, json_encode($debug_data));
        }
    }

    public function add_plugin_slugs_to_debug_info($info)
    {
        if (isset($info['wp-plugins-active']['fields'])) {
            // Get all active plugins
            $active_plugins = get_option('active_plugins');
            $plugin_data = [];
            foreach ($active_plugins as $plugin) {
                // Extract the directory name (slug) from the plugin path
                $plugin_slug = dirname($plugin);
                // If it's just a file without a directory, use the filename as the slug
                if ($plugin_slug === '.') {
                    $plugin_slug = basename($plugin, '.php');
                }
                $plugin_data[$plugin_slug] = get_plugin_data(WP_PLUGIN_DIR.'/'.$plugin);
            }

            foreach ($info['wp-plugins-active']['fields'] as $plugin_name => $plugin_info) {
                foreach ($plugin_data as $slug => $data) {
                    // Match plugin name from debug data with the one retrieved from get_plugin_data
                    if (strpos($plugin_info['label'], $data['Name']) !== false) {
                        $info['wp-plugins-active']['fields'][$plugin_name]['slug'] = $slug;
                        break;
                    }
                }
            }
        }

        return $info;
    }

    public function add_db_schema_to_debug_info($info)
    {
        global $wpdb;
        $tables = $wpdb->get_results('SHOW TABLES', ARRAY_N);
        $tables = array_map('current', $tables);
        foreach ($tables as $table) {
            $rows = $wpdb->get_results('DESCRIBE '.$table, ARRAY_A);
            $header = array_keys($rows[0]);
            array_unshift($rows, $header);
            $info['db-schema']['fields'][$table] = array_map(function ($row) {
                return implode(',', $row);
            }, $rows);

        }

        return $info;
    }
}
