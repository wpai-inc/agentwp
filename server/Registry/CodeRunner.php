<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Models\Code;

class CodeRunner implements Registrable
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register(): void
    {
        add_action('init', [$this, 'run']);
    }

    public function run(): void
    {
        $codePackages = Code::query()->scopeActive()->scopeMode('always')->get();

        foreach ($codePackages as $package) {
            include_once ABSPATH.ltrim($package->path, '/').'/index.php';
        }
    }
}
