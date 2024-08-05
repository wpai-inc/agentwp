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
    private Main $main;
    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register()
    {
        $plugin_file = plugin_basename($this->main->pluginPath());
        if (doing_action('activate_' . $plugin_file)) {
            $this->activate();
        }
        if (doing_action('deactivate_' . $plugin_file)) {
            $this->deactivate();
        }
    }

    public function activate()
    {
        set_transient('agentwp_installing', 'yes', MINUTE_IN_SECONDS * 10);
        if (!defined('WP_CLI') || !WP_CLI) {
            add_action('shutdown', [$this, 'redirect']);
        }
    }

    public function deactivate(): void
    {
        $this->main->settings->disconnectSite($this->main);
    }

    public function redirect(): void
    {
        \wp_safe_redirect($this->main->settingsPage, 302, 'AgentWP');
    }
}
