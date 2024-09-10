<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;

class Transient
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function get(string $key)
    {
        return get_transient($this->main::SLUG);
    }

    public function set(string $key, $value, int $expiration = 0)
    {
        set_transient($this->main::SLUG.$key, $value, $expiration);
    }

    public function delete(string $key)
    {
        delete_transient($this->main::SLUG.$key);
    }
}
