<?php

namespace WpAi\AgentWp\Modules\Summarization;

use WpAi\AgentWp\Contracts\Cacheable;
use WpAi\AgentWp\Modules\Summarization\Sources\Core;
use WpAi\AgentWp\Modules\Summarization\Sources\Plugins\RankMath;
use WpAi\AgentWp\Modules\Summarization\Sources\Plugins\YoastSeo;
use WpAi\AgentWp\Traits\HasCache;

class SiteSummarizer implements Cacheable
{
    use HasCache;

    private array $sources = [
        YoastSeo::class,
        RankMath::class,
        Core::class,
    ];

    public static function cacheId(): string
    {
        return 'summary';
    }

    public function hasUpdated(): bool
    {
        $cache = $this->cache($this->data());

        return ! $cache->hit();
    }

    public function data(): array
    {
        $data = [];

        foreach ($this->sources as $source) {
            $source = new $source;
            if ($source->isActive()) {
                $data[$source->name()] = $source->getData();
            }
        }

        return $data;
    }
}
