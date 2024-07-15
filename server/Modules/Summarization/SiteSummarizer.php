<?php

namespace WpAi\AgentWp\Modules\Summarization;

use WpAi\AgentWp\Modules\Summarization\Sources\Core;
use WpAi\AgentWp\Modules\Summarization\Sources\Plugins\RankMath;
use WpAi\AgentWp\Modules\Summarization\Sources\Plugins\YoastSeo;
use WpAi\AgentWp\Services\Cache;

class SiteSummarizer
{
    private Cache $cache;

    private array $sources = [
        YoastSeo::class,
        RankMath::class,
        Core::class,
    ];

    public function __construct()
    {
        $this->cache = new Cache('summary', $this->data());
    }

    public function hasUpdated(): bool
    {
        return $this->cache->miss();
    }

    public function data(): array
    {
        $data = [];

        foreach ($this->sources as $source) {
            $source = new $source();
            if ($source->isActive()) {
                $data[$source->name()] = $source->getData();
            }
        }

        return $data;
    }
}
