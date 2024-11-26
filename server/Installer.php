<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Database\Schema;
use WpAi\AgentWp\Modules\Summarization\SiteSummarizer;
use WpAi\AgentWp\Registry\IndexSiteData;
use WpAi\AgentWp\Registry\IndexSiteSummary;

/**
 * Handles the plugin activation, deactivation, and uninstallation.
 *
 * @since 0.1.0
 */
class Installer
{
    public static function activate(): void
    {
        $main = Main::getInstance();
        $summarizer = (new IndexSiteSummary($main));
        $summarizer->schedule('autoUpdate', 'weekly');

        (new IndexSiteData($main))->scheduleNow('autoUpdate');

        (new Schema)->createTables();

        set_transient(MAIN::prefix('installing'), 'yes', MINUTE_IN_SECONDS * 10);

        if (! defined('WP_CLI') || ! WP_CLI) {
            add_action('shutdown', [$main, 'settingsRedirect']);
        }
    }

    public static function deactivate(): void
    {
        $main = Main::getInstance();
        IndexSiteData::invalidate();
        SiteSummarizer::invalidate();
        IndexSiteSummary::clearSchedules(['autoUpdate']);

        if ($main->settings->get('general_settings.cleanup_after_deactivate') !== false) {
            (new Schema)->deleteTables();
            $main->auth()->removeCapabilitiesFromAllUsers();
            $main->settings->disconnectSite($main);
            self::cleanup_plugin_data($main);
        }
    }

    public static function cleanup_plugin_data(Main $main)
    {
        global $wpdb;
        $key = Main::SLUG;
        $main->settings->delete('general_settings');
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
}
