<?php

/**
 * Plugin Name: AgentWP
 * Plugin URI: https://agentwp.com
 * Description: Adds a AI Agent to your WordPress installation.
 * Version: 1.2.0
 * Author: WPAI Inc.
 * Author URI: https://wpai.co
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: agentwp
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */
defined('ABSPATH') || exit;

require_once __DIR__.'/vendor/autoload.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$awpPrivateRepo = PucFactory::buildUpdateChecker(
    'https://github.com/wpai-inc/agentwp/',
    __FILE__,
    'agentwp'
);
$awpPrivateRepo->getVcsApi()->enableReleaseAssets();
$awpPrivateRepo->setBranch('main');

register_activation_hook(__FILE__, 'agentwp_boot_plugin');
register_deactivation_hook(__FILE__, 'agentwp_boot_plugin');
add_action('plugins_loaded', 'agentwp_boot_plugin');

/**
 * Registers all the service providers
 * with a Main dependency.
 */
function agentwp_boot_plugin(): void
{
    $main = \WpAi\AgentWp\Main::getInstance(__FILE__);
    $registry = (new \WpAi\AgentWp\ProviderRegistry($main));

    $registry->register([
        \WpAi\AgentWp\Installer::class,
        \WpAi\AgentWp\Registry\Hooks::class,
        \WpAi\AgentWp\Page\Admin\Settings::class,
        \WpAi\AgentWp\Page\Admin\Chat::class,
        \WpAi\AgentWp\Page\Admin\DashboardWidget::class,
        \WpAi\AgentWp\Registry\IndexSiteData::class,
        \WpAi\AgentWp\Registry\IndexSiteSummary::class,
        \WpAi\AgentWp\Registry\IndexThemeJson::class,
        \WpAi\AgentWp\Registry\IndexSiteDocs::class,
        \WpAi\AgentWp\Registry\Router::class,
        \WpAi\AgentWp\Registry\WpUser::class,
    ]);
}
