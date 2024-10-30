<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Registry\IndexSiteData;
use WpAi\AgentWp\Registry\IndexSiteSummary;

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
        $summarizer = (new IndexSiteSummary($this->main));
        $summarizer->schedule('autoUpdate', 'weekly');

        (new IndexSiteData($this->main))->scheduleNow('autoUpdate');

        set_transient(MAIN::prefix('installing'), 'yes', MINUTE_IN_SECONDS * 10);

        if (! defined('WP_CLI') || ! WP_CLI) {
            add_action('shutdown', [$this, 'redirect']);
        }
    }

    public function deactivate(): void
    {
        IndexSiteData::invalidate();
        SiteSummarizer::invalidate();
        IndexSiteSummary::clearSchedules(['autoUpdate']);

        if ($this->main->settings->get('general_settings.cleanup_after_deactivate') !== false) {
            $this->main->settings->disconnectSite($this->main);
            $this->cleanup_plugin_data();
        }
    }

    public function cleanup_plugin_data()
    {
        global $wpdb;
        $key = Main::SLUG;
        $this->main->settings->delete('general_settings');
        delete_option($key.'_summary');
        delete_option($key.'_site_summary');
        delete_option($key.'_site_data');
        delete_option($key.'_site_theme_json');

        $wpdb->query(
            $wpdb->prepare("DELETE FROM $wpdb->options WHERE option_name LIKE %s AND option_name LIKE %s", [
                '%'.$wpdb->esc_like($key).'%',
                '%_transient%',
            ])
        );

    }

    public function redirect(): void
    {
        \wp_safe_redirect($this->main->settingsPageUrl, 302, 'AgentWP');
    }
}
