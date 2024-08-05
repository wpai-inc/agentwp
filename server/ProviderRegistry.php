<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class ProviderRegistry
{
    private Main $main;
    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register(array $providers)
    {
        foreach ($providers as $class) {
            if (!class_exists($class)) {
                throw new \Exception("Class $class does not exist");
            }

            if (!is_a($class, Registrable::class, true)) {
                throw new \Exception("Class $class does not implement Registerable");
            }

            (new $class($this->main))->register();
        }
    }
}
