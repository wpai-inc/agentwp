<?php

namespace WpAi\AgentWp\Modules\SiteData;

use WpAi\AgentWp\Modules\Summarization\Sources\Core;
use WpAi\AgentWp\Modules\Summarization\Sources\Plugins\RankMath;
use WpAi\AgentWp\Modules\Summarization\Sources\Plugins\YoastSeo;
use WpAi\AgentWp\Services\Cache;

class SiteData
{
    private Cache $cache;

    public function __construct()
    {
        add_filter('debug_information', [$this, 'add_plugin_slugs_to_debug_info']);
        add_filter('debug_information', [$this, 'add_db_schema_to_debug_info']);
        add_filter('debug_information', [$this, 'add_woocommerce_settings_to_debug_info']);

        $this->cache = new Cache('site_data', $this->data());
    }

    public function hasUpdated(): bool
    {
        return $this->cache->miss();
    }

    /**
     * @return Cache
     */
    public function getData()
    {
        return $this->cache->getData();
    }

    private function data(): array
    {
        if (! class_exists('\WP_Debug_Data')) {
            require_once ABSPATH.'wp-admin/includes/class-wp-debug-data.php';
        }
        if (! class_exists('\WP_Site_Health')) {
            require_once ABSPATH.'wp-admin/includes/class-wp-site-health.php';
        }
        if (! function_exists('\get_core_updates')) {
            require_once ABSPATH.'wp-admin/includes/update.php';
        }
        if (! function_exists('\get_dropins')) {
            require_once ABSPATH.'wp-admin/includes/plugin.php';
        }
        if (! function_exists('\got_url_rewrite')) {
            require_once ABSPATH.'wp-admin/includes/misc.php';
        }
        if (! function_exists('\get_option')) {
            require_once ABSPATH.'wp-includes/option.php';
        }

        $debug_data = \WP_Debug_Data::debug_data();

        $debug_data['cpts'] = $this->getCpts();
        $debug_data['taxonomies'] = $this->getTaxonomies();
        $debug_data['general_settings'] = $this->getGeneralSettings();

        return $debug_data;
    }

    /**
     * return an array containing the general settings
     *
     * @return array
     */
    private function getGeneralSettings(): array
    {
        return [
            'blogname' => get_option('blogname'),
            'blogdescription' => get_option('blogdescription')
        ];
    }

    /**
     * return an array containing all the custom post types
     *
     * @return array
     */
    private function getCpts(): array
    {
        $args = [
            'public' => true,
            '_builtin' => false,
        ];

        $post_types = get_post_types($args, 'objects');

        return array_map(
            function ($post_type) {
                $post_type = get_object_vars($post_type);
                unset($post_type['labels']);
                return $post_type;
            },
            $post_types
        );
    }

    /**
     * return an array containing all the custom taxonomies
     *
     * @return array
     */
    private function getTaxonomies(): array
    {
        $args = [
            'public' => true,
            '_builtin' => false,
        ];

        $taxonomies = get_taxonomies($args, 'objects');

        return array_map(
            function ($taxonomy) {
                $taxonomy = get_object_vars($taxonomy);
                unset($taxonomy['labels']);
                return $taxonomy;
            },
            $taxonomies
        );
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
                $plugin_data[$plugin_slug] = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);
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
        $tables = $wpdb->get_results('SHOW TABLES', ARRAY_N);
        $tables = array_map('current', $tables);
        foreach ($tables as $table) {
            $rows = $wpdb->get_results('DESCRIBE ' . $table, ARRAY_A);
            $header = array_keys($rows[0]);
            array_unshift($rows, $header);
            $info['db-schema']['tables'][$table] = array_map(function ($row) {
                return implode(',', $row);
            }, $rows);
        }

        return $info;
    }
}
