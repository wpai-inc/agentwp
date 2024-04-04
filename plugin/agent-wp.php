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
 * Requires PHP: 8.1
 */
defined('ABSPATH') || exit;

require_once __DIR__.'/vendor/autoload.php';

/**
 * Registers all of the service providers
 * with a Main dependency.
 */
(new \WpAi\AgentWp\ProviderRegistry(
    new \WpAi\AgentWp\Main(__FILE__)
))->register([
    \WpAi\AgentWp\Installer::class,
    \WpAi\AgentWp\Page\Admin\Settings::class,
    \WpAi\AgentWp\Page\Admin\Chat::class,
]);

// add a class to the admin body
add_filter('admin_body_class', function ($classes) {
    $classes .= ' bg-slate-500';

    return $classes;
});
