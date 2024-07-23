<?php

namespace WpAi\AgentWp\Modules\Summarization\Sources\Plugins;

use WpAi\AgentWp\Modules\Summarization\Sources\SourceInterface;

class YoastSeo implements SourceInterface
{
    public function name(): string
    {
        return 'yoast_seo';
    }

    public function isActive(): bool
    {
        return is_plugin_active('wordpress-seo/wp-seo.php')
            || is_plugin_active('wordpress-seo-premium/wp-seo-premium.php');
    }

    public function getData(): array
    {
        $rest_url = get_rest_url(null, 'yoast/v1/get_head');
        $data = wp_remote_get($rest_url . '?url=' . get_home_url());

        var_dump($data);
        
        return [];
    }
}
