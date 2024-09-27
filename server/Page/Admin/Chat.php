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
     * 
     * @return void
     */
    public function onLocations() {

        $matched = false;
        foreach ($this->restrictedUrls() as $pattern) {
            if (preg_match('#' . str_replace('#', '\#', $pattern) . '#', esc_url_raw($_SERVER['REQUEST_URI']))) {
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
     * 
     * @return array
     */
    public function restrictedUrls(): array
    {
        $data = $this->globalData();
        $data = ! empty( $data ) && isset( $data['general_settings'] ) ? $data['general_settings'] : [];
        $data = isset( $data['restricted_urls'] ) ? $data['restricted_urls'] : [];
        $data = explode( "\n", $data );

        foreach ( $data as $key => $value ) {
            $data[ $key ] = str_ireplace( home_url(), '', $value );
        }

        $data = array_filter( array_unique( $data ) );
        return $data;
    }

    public function data(): array
    {
        return [];
    }
}
