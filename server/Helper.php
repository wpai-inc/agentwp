<?php

namespace WpAi\AgentWp;

class Helper
{
    public static function config(string $name, $default = null)
    {
        return $_ENV[$name] ?? $default;
    }
}
