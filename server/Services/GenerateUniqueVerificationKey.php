<?php

namespace WpAi\AgentWp\Services;

use WpAi\AgentWp\Main;

class GenerateUniqueVerificationKey
{
    public static function get(): string
    {
        $key = uniqid(Main::SLUG, true);
        $main = Main::getInstance();
        $main->settings->set('verification_key', $key);

        return $key;
    }
}
