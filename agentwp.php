<?php

use WpAi\AgentWp\Installer;

/**
 * Plugin Name: AgentWP
 * Plugin URI: https://agentwp.com
 * Description: Adds a AI Agent to your WordPress installation.
 * Version: 1.4.0
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

require_once __DIR__.'/autoload.php';

$main = \WpAi\AgentWp\Main::getInstance(__FILE__);

register_activation_hook(__FILE__, [Installer::class, 'activate']);
register_deactivation_hook(__FILE__, [Installer::class, 'deactivate']);

$main->boot();
