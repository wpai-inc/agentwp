<?php

namespace WpAi\AgentWp;

/**
 * Initializes the plugin.
 *
 * @since 0.1.0
 */
class Init
{
    public function __construct(private string $file)
    {
        //
    }

    public function boot()
    {
        register_activation_hook($this->file, [Installer::class, 'activate']);
        register_activation_hook($this->file, [Installer::class, 'deactivate']);
    }
}
