<?php

namespace WpAi\AgentWp\Services;

class Transient
{
    private const PREFIX = 'agentwp_';

    public static function get(string $key)
    {
        return get_transient(self::PREFIX.$key);
    }

    public static function set(string $key, $value, int $expiration = 0)
    {
        set_transient(self::PREFIX.$key, $value, $expiration);
    }

    public static function delete(string $key)
    {
        delete_transient(self::PREFIX.$key);
    }
}
