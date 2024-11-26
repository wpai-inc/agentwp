<?php
/*
Plugin Name: Red Border Notifier
Description: Adds a red border to the body and alerts the user about it.
Version: 1.0
Author: Your Name
*/

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class RedBorderNotifier
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    /**
     * Enqueue the CSS and JavaScript for the plugin.
     */
    public function enqueue_assets()
    {
        // Enqueue the CSS file
        wp_enqueue_style(
            'red-border-notifier-css',
            plugin_dir_url(__FILE__).'/css/main.css'
        );

        // Enqueue the JavaScript file
        wp_enqueue_script(
            'red-border-notifier-js',
            plugin_dir_url(__FILE__).'/js/main.js',
            [],
            null,
            true
        );
    }
}

// Initialize the plugin
new RedBorderNotifier;
