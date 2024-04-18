<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Actions\TestAction;
use WpAi\AgentWp\Contracts\Registrable;

class AdminActions implements Registrable
{
    protected array $actions = [
        'test_action' => TestAction::class,
    ];

    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        foreach ($this->actions as $action) {
            $name = implode('_', [
                'wp_ajax', $this->main::SLUG, $action,
            ]);
            add_action($name, [new $action($this->main::SLUG), '__invoke']);
        }
    }
}
