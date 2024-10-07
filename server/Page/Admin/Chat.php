<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\Client\ReactClient;

class Chat extends ReactClient
{
    /**
     * Order matters, later locations take precedence.
     */
    protected array $locations = [];

    /**
     * Setup locations.
     */
    public function onLocations(): void
    {
        if (! isset($_SERVER['REQUEST_URI'])) {
            return;
        }

        $matched = false;
        $requestUri = \sanitize_url(wp_unslash($_SERVER['REQUEST_URI']));
        foreach ($this->restrictedUrls() as $pattern) {
            if (preg_match('#'.str_replace('#', '\#', $pattern).'#', $requestUri)) {
                $matched = true;
                break;
            }
        }

        if ($matched) {
            return;
        }

        $this->locations = [
            \WpAi\AgentWp\Client\Locations\CoreChat::class,
            \WpAi\AgentWp\Client\Locations\ElementorChat::class,
            \WpAi\AgentWp\Client\Locations\BeaverBuilder::class,
            \WpAi\AgentWp\Client\Locations\BricksBuilder::class,
            \WpAi\AgentWp\Client\Locations\CustomizePage::class,
        ];
    }

    /**
     * Get restricted urls.
     */
    public function restrictedUrls(): array
    {
        $data = $this->main->settings->getGeneralSettings();
        $data = isset($data['restricted_urls']) ? $data['restricted_urls'] : [];
        $data = explode("\n", $data);

        foreach ($data as $key => $value) {
            $data[$key] = str_ireplace(home_url(), '', $value);
        }

        $data = array_filter(array_unique($data));

        return $data;
    }

    public function data(): array
    {
        return [];
    }
}
