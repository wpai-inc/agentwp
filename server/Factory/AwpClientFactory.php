<?php

namespace WpAi\AgentWp\Factory;

use WpAi\AgentWp\Services\AwpClient;

class AwpClientFactory
{
    private function __construct() {}

    public static function create(string $token): AwpClient
    {
        return new AwpClient($token);
    }
}