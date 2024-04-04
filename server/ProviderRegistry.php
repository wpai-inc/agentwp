<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class ProviderRegistry
{
    public function __construct(private Main $main)
    {
    }

    public function register(array $providers)
    {
        foreach ($providers as $class) {
            if (! class_exists($class)) {
                throw new \Exception("Class $class does not exist");
            }

            if (! is_a($class, Registrable::class, true)) {
                throw new \Exception("Class $class does not implement Registerable");
            }

            (new $class($this->main))->register();
        }
    }
}
