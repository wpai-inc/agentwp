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
            is_plugin_active('seo-by-rank-math/rank-math.php') ||
            is_plugin_active('seo-by-rank-math-pro/rank-math-pro.php')
        ) && function_exists('rank_math');
    }

    public function getData(): array
    {
        if (! class_exists('\RankMath\Rest\Headless') || ! method_exists('\RankMath\Rest\Headless', 'get_head')) {
            return [];
        }

        if (! rank_math()->variables || ! method_exists(rank_math()->variables, 'setup')) {
            return [];
        }

        $data = (new \RankMath\Rest\Headless)->get_head(new \WP_REST_Request());
        if (is_wp_error($data) || empty($data) || ! isset($data->data) || empty($data->data)) {
            return [];
        }

        preg_match('/<script type="application\/ld\+json" class="rank-math-schema">(.+?)<\/script>/', $data->data['head'], $matches);
        $json_string = $matches[1] ?? '';
        $schema = json_decode($json_string, true);
        if (! is_array($schema)) {
            return [];
        }

        return $schema;
    }
}
