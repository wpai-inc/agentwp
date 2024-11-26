<?php

namespace WpAi\AgentWp\Models;

if (! defined('ABSPATH')) {
    exit;
}

class BaseModel
{
    const PLUGIN_NAMESPACE = 'agentwp_';

    protected static $table;

    protected static $primaryKey = 'id';

    protected $attributes = [];

    protected $whereClauses = [];

    protected $bindings = [];

    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    public function __get($key)
    {
        return $this->attributes[$key] ?? null;
    }

    public function __set($key, $value)
    {
        $this->attributes[$key] = $value;
    }

    public static function query()
    {
        return new static;
    }

    public function where($column, $operator, $value)
    {
        $this->whereClauses[] = "`$column` $operator %s";
        $this->bindings[] = $value;

        return $this;
    }

    public function get()
    {
        global $wpdb;

        $results = $wpdb->get_results($this->toSql());

        return array_map(function ($result) {
            return new static((array) $result);
        }, $results);
    }

    private function getTable(): string
    {
        global $wpdb;

        return $wpdb->prefix.self::PLUGIN_NAMESPACE.static::$table;
    }

    private function toSql(): string
    {
        global $wpdb;

        $table = $this->getTable();
        $where = ! empty($this->whereClauses) ? 'WHERE '.implode(' AND ', $this->whereClauses) : '';

        return $wpdb->prepare("SELECT * FROM `$table` $where", ...$this->bindings);
    }
}
