<?php

namespace WpAi\AgentWp\Traits;

trait SiteSettings
{
    private function parseSettings(array $settings): array
    {
        $parsedSettings = [];

        foreach ($settings as $setting) {
            $parsedSettings[$setting['name']] = $setting['value'];
        }

        return $parsedSettings;
    }
}
