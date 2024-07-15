<?php

namespace WpAi\AgentWp\Modules\Summarization\Sources\Plugins;

use WpAi\AgentWp\Modules\Summarization\Sources\SourceInterface;

class RankMath implements SourceInterface
{
    public function name(): string
    {
        return 'rank_math';
    }

    public function isActive(): bool
    {
        return (
            is_plugin_active('seo-by-rank-math/rank-math.php') || is_plugin_active('seo-by-rank-math-pro/rank-math-pro.php')
        ) && function_exists('rank_math');
    }

    public function getData(): array
    {
        return [];
    }
}
