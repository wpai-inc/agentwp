<?php

namespace WpAi\AgentWp\Services;

class Cache
{
    private string $hash;

    private string $key;

    /**
     * @var mixed
     */
    private $data;

    public function __construct(string $id, $data = null)
    {
        $this->data = $data;
        $this->key = "agentwp_{$id}";
        $this->hash = md5(json_encode($data));
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function hit(): bool
    {
        $last_hash = get_option($this->key);

        if ($last_hash !== $this->hash) {
            update_option($this->key, $this->hash);

            return false;
        }

        return true;
    }

    public function getData()
    {
        return $this->data;
    }

    public static function invalidateId(string $id): bool
    {
        return (new Cache($id))->invalidate();
    }

    public function invalidate(): bool
    {
        return delete_option($this->key);
    }
}
