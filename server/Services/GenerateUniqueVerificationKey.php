<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;
use WpAi\AgentWp\Settings;

class GenerateUniqueVerificationKey
{
    public function __construct(private Settings $settings) {}

    public function get(): string
    {
        $key = uniqid(Main::SLUG, true);
        $this->settings->set('verification_key', $key);

        return $key;
    }
}
