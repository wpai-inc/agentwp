<?php

namespace WpAi\AgentWp\Services;

class Cache
{
    private string $hash;

    private string $key;

    public function __construct(string $id, private $data)
    {
        $this->key = "agentwp_{$id}";
        $this->hash = md5(json_encode($data));
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

    private function hit(): bool
    {
        $last_hash = get_option($this->key);

        return $last_hash === $this->hash;
    }

    private function invalidate()
    {
        update_option($this->key, $this->hash, true);
    }
}
