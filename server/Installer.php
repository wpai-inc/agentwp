<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Registry\SiteIndexer;

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
        if (doing_action('activate_'.$plugin_file)) {
            $this->activate();
        }
        if (doing_action('deactivate_'.$plugin_file)) {
            $this->deactivate();
        }
    }

    public function activate()
    {
        set_transient('agentwp_installing', 'yes', MINUTE_IN_SECONDS * 10);
        if (! defined('WP_CLI') || ! WP_CLI) {
            add_action('shutdown', [$this, 'redirect']);
        }
    }

    public function deactivate(): void
    {
        SiteIndexer::invalidate();
        SiteSummarizer::invalidate();

        if ($this->main->settings->get('general_settings.cleanup_after_deactivate')) {
            $this->main->settings->disconnectSite($this->main);
            $this->cleanup_plugin_data();
        }
    }

    public function cleanup_plugin_data()
    {
        $key = $this->main->settings::SLUG;
        $this->main->settings->delete('general_settings');
        delete_option($key.'_summary');
        delete_option($key.'_site_data');
        global $wpdb;
        $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '%{$key}%' option_name LIKE '%_transient%'");
    }

    public function redirect(): void
    {
        \wp_safe_redirect($this->main->settingsPage, 302, 'AgentWP');
    }
}
