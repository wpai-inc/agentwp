<?php

namespace WpAi\AgentWp\Traits;

use WpAi\AgentWp\Services\Cache;

trait HasCache
{
    public function cache($data = null): Cache
    {
        return new Cache(self::cacheId(), $data);
    }

    public static function invalidate(): bool
    {
        return Cache::invalidateId(self::cacheId());
    }
}
