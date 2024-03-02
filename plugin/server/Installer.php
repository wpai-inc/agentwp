<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

/**
 * Handles the plugin activation, deactivation, and uninstallation.
 *
 * @since 0.1.0
 */
class Installer implements Registrable
{
    public function __construct(private Main $main)
    {
        //
    }

    public function register()
    {
        register_activation_hook($this->main->pluginPath(), [$this, 'activate']);
        register_activation_hook($this->main->pluginPath(), [$this, 'deactivate']);
    }

    public function activate()
    {
        //
    }

    public function deactivate()
    {
        //
    }
}
