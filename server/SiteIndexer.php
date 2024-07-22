<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Services\AwpClient;
use WpAi\AgentWp\Services\Cache;

class SiteIndexer extends \WP_Async_Request implements Registrable
{
    protected $prefix = 'agentwp';

    protected $action = 'site_indexer';

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

    public function indexSite()
    {
        if ($this->main->siteId()) {
            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }

            $cache = new Cache('site_data', SiteData::getDebugData());
            if ($cache->miss()) {
                $this->data(['data' => $cache->data()])->dispatch();
            }
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

    /**
     * Handle a dispatched request.
     */
    protected function handle()
    {
        (new AwpClient($this->main, false))->indexSite(json_encode($_POST['data']));
    }
}
