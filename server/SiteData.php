<?php

namespace WpAi\AgentWp;

class SiteData
{
    public static function getDebugData(): array
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

        $debug_data['cpts'] = self::getCpts();
        $debug_data['taxonomies'] = self::getTaxonomies();
        $debug_data['general_settings'] = self::getGeneralSettings();

        return $debug_data;
    }

    /**
     * return an array containing the general settings
     *
     * @return array
     */
    public static function getGeneralSettings(): array
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
    public static function getCpts(): array
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
    public static function getTaxonomies(): array
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
}
