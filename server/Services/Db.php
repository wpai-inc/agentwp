<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;

class Db
{
    public static function cacheGroup(): string
    {
        return Main::SLUG.'_custom_db_queries';
    }

    public static function cacheKey(string $query, array $params, string $type = ''): string
    {
        return md5($query.serialize($params).$type);
    }

    public static function query($query, $params = [])
    {
        global $wpdb;
        $cache_key = self::cacheKey($query, $params);
        $cache_group = self::cacheGroup();

        // Try to get the result from cache
        $result = wp_cache_get($cache_key, $cache_group);
        if ($result === false) {
            $sql = $wpdb->prepare($query, ...$params);
            $result = $wpdb->query($sql);
            // Store the result in cache
            wp_cache_set($cache_key, $result, $cache_group, 60);
        }

        return $result;
    }

    public static function getResults($query, $params = [], $type = OBJECT)
    {
        global $wpdb;
        $cache_key = self::cacheKey($query, $params, $type);
        $cache_group = self::cacheGroup();

        // Try to get the result from cache
        $result = wp_cache_get($cache_key, $cache_group);
        if ($result === false) {
            $sql = $wpdb->prepare($query, ...$params);
            $result = $wpdb->get_results($sql, $type);
            // Store the result in cache
            wp_cache_set($cache_key, $result, $cache_group, 60);
        }

        return $result;
    }
}
