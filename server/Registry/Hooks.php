<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;

class Hooks implements Registrable
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register()
    {
        add_action('agentwp_set_access_token', [$this, 'autoUpdate']);
        add_action('switch_theme', [$this, 'autoUpdate']);
    }

    public function autoUpdate()
    {
        $summarizer = (new IndexSiteSummary($this->main));
        $summarizer->scheduleNow('autoUpdate');

        $themeJson = (new IndexThemeJson($this->main));
        $themeJson->scheduleNow('autoUpdate');
    }
}
