<?php

namespace AgentWP\Server\Services;

class Db
{
    public static function query($query, $params = [])
    {
        global $wpdb;
        $cache_key = md5($query.serialize($params));
        $cache_group = 'custom_db_queries';

        // Try to get the result from cache
        $result = wp_cache_get($cache_key, $cache_group);
        if ($result === false) {
            if (empty($params)) {
                $result = $wpdb->get_results($query);
            } else {
                $result = $wpdb->query($wpdb->prepare($query, ...$params));
            }
            // Store the result in cache
            wp_cache_set($cache_key, $result, $cache_group, 60);
        }

        return $result;
    }

    public static function getResults($query, $params = [], $type = OBJECT)
    {
        global $wpdb;
        $cache_key = md5($query.serialize($params).$type);
        $cache_group = 'custom_db_queries';

        // Try to get the result from cache
        $result = wp_cache_get($cache_key, $cache_group);
        if ($result === false) {
            if (empty($params)) {
                $result = $wpdb->get_results($query, $type);
            } else {
                $result = $wpdb->get_results($wpdb->prepare($query, ...$params), $type);
            }
            // Store the result in cache
            wp_cache_set($cache_key, $result, $cache_group, 60);
        }

        return $result;
    }
}
