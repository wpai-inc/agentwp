<?php

namespace WpAi\AgentWp\Contracts;

use WpAi\AgentWp\Services\Cache;

interface Cacheable
{
    public static function cacheId(): string;

    public static function invalidate(): bool;

    public function cache($data): Cache;
}
