<?php
/**
 * Plugin Name: Agent WP
 * Plugin URI: https://codewp.ai
 * Description: Adds a AI Agent to your WordPress installation.
 * Version: 0.1.0
 * Author: WP AI Inc.
 * Author URI: https://codewp.ai
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: agent-wp
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 7.0
 */
defined('ABSPATH') || exit;

require_once __DIR__.'/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

/**
 * Registers all of the service providers
 * with a Main dependency.
 */
add_action('plugins_loaded', function () {
    (new \WpAi\AgentWp\ProviderRegistry(
        new \WpAi\AgentWp\Main(__FILE__)
    ))->register([
        \WpAi\AgentWp\Installer::class,
        \WpAi\AgentWp\Page\Admin\Settings::class,
        \WpAi\AgentWp\Page\Admin\Chat::class,
        \WpAi\AgentWp\SiteIndexer::class,
        \WpAi\AgentWp\ErrorIndexer::class,
    ]);
});
