<?php

/**
 * Plugin Name: AgentWP
 * Plugin URI: https://codewp.ai
 * Description: Adds a AI Agent to your WordPress installation.
 * Version: 0.1.4
 * Author: WP AI Inc.
 * Author URI: https://codewp.ai
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: agentwp
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */
defined('ABSPATH') || exit;

require_once __DIR__.'/vendor/autoload.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$MyUpdateChecker = PucFactory::buildUpdateChecker(
    'https://plugin.agentwp.com/?action=get_metadata&slug=agentwp',
    __FILE__,
    'agentwp'
);

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

register_activation_hook(__FILE__, 'agentwp_bootstrap');
register_deactivation_hook(__FILE__, 'agentwp_bootstrap');
add_action('plugins_loaded', 'agentwp_bootstrap');

/**
 * Registers all the service providers
 * with a Main dependency.
 */
function agentwp_bootstrap(): void
{
    (new \WpAi\AgentWp\ProviderRegistry(
        new \WpAi\AgentWp\Main(__FILE__)
    ))->register([
        \WpAi\AgentWp\Installer::class,
        \WpAi\AgentWp\Page\Admin\Settings::class,
        \WpAi\AgentWp\Page\Admin\Chat::class,
        \WpAi\AgentWp\Page\Admin\DashboardWidget::class,
        \WpAi\AgentWp\Registry\IndexSiteData::class,
        \WpAi\AgentWp\Registry\IndexSiteSummary::class,
        \WpAi\AgentWp\Registry\ErrorIndexer::class,
        \WpAi\AgentWp\Registry\Router::class,
        \WpAi\AgentWp\Registry\WpUser::class,
    ]);
}
