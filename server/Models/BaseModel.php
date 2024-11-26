<?php

namespace WpAi\AgentWp\Models;

use JsonSerializable;

if (! defined('ABSPATH')) {
    exit;
}

class BaseModel implements JsonSerializable
{
    const PLUGIN_NAMESPACE = 'agentwp_';

    protected static $table;

    protected static $primaryKey = 'id';

    protected $attributes = [];

    protected $whereClauses = [];

    protected $bindings = [];

    protected array $casts = [];

    public function __construct(array $attributes = [])
    {
        $this->attributes = $this->cast($attributes);
    }

    public function __get($key)
    {
        return $this->attributes[$key] ?? null;
    }

    public function __set($key, $value)
    {
        $this->attributes[$key] = $value;
    }

    public static function find($id)
    {
        return static::query()->where(static::$primaryKey, '=', $id)->get()[0] ?? null;
    }

    public static function create(array $attributes)
    {
        global $wpdb;

        $table = static::getTable();

        $wpdb->insert($table, $attributes);

        return static::find($wpdb->insert_id);
    }

    public function update(array $attributes)
    {
        global $wpdb;

        $this->attributes = array_merge($this->attributes, $attributes);
        $table = static::getTable();
        $wpdb->update($table, $this->attributes, [static::$primaryKey => $this->{static::$primaryKey}]);

        return $this;
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

    public static function getTable(): string
    {
        global $wpdb;

        return $wpdb->prefix.self::PLUGIN_NAMESPACE.static::$table;
    }

    private function toSql(): string
    {
        global $wpdb;

        $table = static::getTable();
        $where = ! empty($this->whereClauses) ? 'WHERE '.implode(' AND ', $this->whereClauses) : '';

        return $wpdb->prepare("SELECT * FROM `$table` $where", ...$this->bindings);
    }

    /**
     * Convert the model instance to an array.
     */
    public function toArray(): array
    {
        return $this->attributes;
    }

    /**
     * Prepare the model for JSON serialization.
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    protected function cast(array $attributes): array
    {
        foreach ($this->casts as $key => $type) {
            if (isset($attributes[$key])) {
                $attributes[$key] = $this->castAttribute($type, $attributes[$key]);
            }
        }

        return $attributes;
    }

    protected function castAttribute($type, $value)
    {
        if ($value === null) {
            return $value;
        }

        switch ($type) {
            case 'int':
                return (int) $value;
            case 'bool':
                return (bool) $value;
            default:
                return $value;
        }
    }
}
