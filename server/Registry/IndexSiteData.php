<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Cacheable;
use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\SiteData;
use WpAi\AgentWp\Traits\HasCache;
use WpAi\AgentWp\Traits\HasScheduler;

class IndexSiteData implements Cacheable, Registrable
{
    use HasCache, HasScheduler;

    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public static function cacheId(): string
    {
        return 'site_data';
    }

    public function register(): void
    {
        if (! wp_doing_ajax()) {
            $this->registerActionSchedules(['autoUpdate']);

            add_filter('debug_information', [$this, 'add_plugin_slugs_to_debug_info']);
            add_filter('debug_information', [$this, 'add_db_schema_to_debug_info']);
            add_filter('debug_information', [$this, 'add_woocommerce_settings_to_debug_info']);
        }
    }

    public function autoUpdate(): void
    {
        if (! $this->main->siteId() || (defined('DOING_AJAX') && DOING_AJAX)) {
            return;
        }

        $cache = $this->cache(SiteData::getDebugData());

        if (! $cache->hit()) {
            $this->send($cache->getData());
        }
    }

    public function send($data = null): void
    {
        if (is_null($data)) {
            $data = SiteData::getDebugData();
        }

        /**
         * Don't send anything if health is disabled.
         */
        if (! $this->getSetting('healthEnabled')) {
            return;
        }

        $this->main->client()->siteHealth($data);
    }

    public function add_plugin_slugs_to_debug_info($info): array
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

    public function add_woocommerce_settings_to_debug_info($info): array
    {
        $custom_orders_table_enabled = get_option('woocommerce_custom_orders_table_enabled', false);
        $info['woocommerce']['custom_orders_table_enabled'] = $custom_orders_table_enabled;

        return $info;
    }

    public function add_db_schema_to_debug_info($info): array
    {
        global $wpdb;
        /**
         * Dont add db schema if it's disabled.
         */
        if (! $this->getSetting('dbSchemaEnabled')) {
            return $info;
        }

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
     * Get the setting value.
     *
     * @param  string  $key
     * @return mixed
     */
    private function getSetting($key)
    {
        $accountSettings = $this->main->accountSettings()->get();
        foreach ($accountSettings as $setting) {
            if ($setting['name'] === $key) {
                return $setting['value'];
            }
        }

        return null;
    }
}
