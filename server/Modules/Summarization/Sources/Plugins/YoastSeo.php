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
        return \is_plugin_active('wordpress-seo/wp-seo.php')
            || \is_plugin_active('wordpress-seo-premium/wp-seo-premium.php');
    }

    public function getData(): array
    {
        $front_page = \get_option('page_on_front');
        $rest_url = ! empty($front_page) ? \get_rest_url(null, 'wp/v2/pages/'.$front_page) : \get_rest_url(null, 'wp/v2/posts/');

        /**
         * Check if URL contains port number.
         * For local development, the URL may contain port number which needs to be removed.
         */
        if (strpos($rest_url, ':') !== false) {
            $port_number = wp_parse_url($rest_url, PHP_URL_PORT);
            $rest_url = str_replace(':'.$port_number, '', $rest_url);
        }

        $data = \wp_remote_get(
            $rest_url,
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]
        );

        if (\is_wp_error($data)) {
            return [];
        }

        $data = json_decode(\wp_remote_retrieve_body($data), true);
        if (empty($data)) {
            return [];
        }

        $schema = isset($data['yoast_head_json']) && isset($data['yoast_head_json']['schema']) ? $data['yoast_head_json']['schema'] : [];

        return $schema;
    }
}
