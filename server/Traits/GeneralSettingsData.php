<?php

namespace WpAi\AgentWp\Traits;

trait GeneralSettingsData
{
// Sanitize settings before saving
    public function sanitize_settings($settings): array
    {
        $defaults = array(
            'cleanup_after_deactivate' => true,
        );

        // Merge with defaults and only allow defined keys
        $settings = wp_parse_args($settings, $defaults);
        $settings = array_intersect_key($settings, $defaults);

        return $settings;
    }
}
