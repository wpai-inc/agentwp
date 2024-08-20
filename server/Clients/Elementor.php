<?php

namespace WpAi\AgentWp\Clients;

use Kucrut\Vite;
use WpAi\AgentWp\Main;

class Elementor
{
    private Main $main;

    private array $deps = [];

    private array $scripts = [];

    private array $styles = [];

    private array $views = [];

    private array $components = [];

    public function __construct(Main $main)
    {
        // If elementor is installed
        if (defined('ELEMENTOR_VERSION')) {
            $this->init();
            $this->main = $main;
        }
    }

    private function init()
    {
        Vite\enqueue_asset(
            $this->main->buildPath(),
            'chat',
            [
                'dependencies' => ['react', 'react-dom'],
                'handle' => 'agentwp-chat',
                'in-footer' => true,
            ]
        );
    }
}
