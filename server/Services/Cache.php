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

    public function miss(): bool
    {
        if ($this->hit()) {
            return false;
        }

        $this->invalidate();

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

    private function invalidate(): bool
    {
        return delete_option($this->key);
    }

    private function hit(): bool
    {
        $last_hash = get_option($this->key);

        return $last_hash === $this->hash;
    }
}
