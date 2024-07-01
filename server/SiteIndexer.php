<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Services\AwpClient;

class SiteIndexer implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        add_action('admin_init', [$this, 'indexSite']);
        add_filter('debug_information', [$this, 'add_plugin_slugs_to_debug_info']);
        add_filter('debug_information', [$this, 'add_db_schema_to_debug_info']);
        add_filter('debug_information', [$this, 'add_woocommerce_settings_to_debug_info']);
    }

    /**
     * Temporary for demo, terrible performance.
     * Needs to run intermittently and check for hash changes before sending
     * Explore: transients or cron jobs
     * 2024-05-20: Hash check implemented; It will only be sent on admin init if is not an AJAX request
     * TODO: probably use a cron job to send the data (BUT the cron job can be disabled)
     */
    public function indexSite()
    {
        if ($siteId = $this->main->siteId()) {

            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }

            $debug_data = SiteData::getDebugData();
            $awpClient = new AwpClient($this->main, false);

            $data = json_encode($debug_data);
            $data_hash = md5($data);

            $last_hash = get_option('agentwp_last_hash');
            if ($last_hash === $data_hash) {
                return;
            }

            update_option('agentwp_last_hash', $data_hash, true);

            $awpClient->indexSite($data);
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

    public function add_woocommerce_settings_to_debug_info($info)
    {
        $custom_orders_table_enabled = get_option('woocommerce_custom_orders_table_enabled', false);
        $info['woocommerce']['custom_orders_table_enabled'] = $custom_orders_table_enabled;

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
            $info['db-schema']['tables'][$table] = array_map(function ($row) {
                return implode(',', $row);
            }, $rows);
        }

        return $info;
    }
}
