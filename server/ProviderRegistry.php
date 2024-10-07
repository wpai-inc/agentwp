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

    /**
     * @throws \Exception
     */
    public function register(array $providers)
    {
        foreach ($providers as $class) {
            if (! class_exists($class)) {
                // Translators: %1$s is the class name that does not exist.
                throw new \Exception(sprintf(__('Class %1$s does not exist', 'agentwp'), esc_html($class)));
            }

            if (! is_a($class, Registrable::class, true)) {
                // Translators: %1$s is the class name that does not implement Registrable.
                throw new \Exception(sprintf(__('Class %1$s does not implement Registrable', 'agentp'), esc_html($class)));
            }

            (new $class($this->main))->register();
        }
    }
}
