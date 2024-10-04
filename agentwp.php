<?php

/**
 * Plugin Name: AgentWP
 * Plugin URI: https://codewp.ai
 * Description: Adds a AI Agent to your WordPress installation.
 * Version: 1.0.0
 * Author: WPAI Inc.
 * Author URI: https://codewp.ai
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: agentwp
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */
defined('ABSPATH') || exit;

require_once __DIR__.'/vendor/autoload.php';

register_activation_hook(__FILE__, 'bootAgentWP');
register_deactivation_hook(__FILE__, 'bootAgentWP');
add_action('plugins_loaded', 'bootAgentWP');

/**
 * Registers all the service providers
 * with a Main dependency.
 */
function bootAgentWP(): void
{
    $main = \WpAi\AgentWp\Main::getInstance(__FILE__);
    $registry = (new \WpAi\AgentWp\ProviderRegistry($main));

    $registry->register([
        \WpAi\AgentWp\Installer::class,
        \WpAi\AgentWp\Page\Admin\Settings::class,
        \WpAi\AgentWp\Page\Admin\Chat::class,
        \WpAi\AgentWp\Page\Admin\DashboardWidget::class,
        \WpAi\AgentWp\Registry\IndexSiteData::class,
        \WpAi\AgentWp\Registry\IndexSiteSummary::class,
        \WpAi\AgentWp\Registry\IndexSiteDocs::class,
        \WpAi\AgentWp\Registry\Router::class,
        \WpAi\AgentWp\Registry\WpUser::class,
    ]);
}
