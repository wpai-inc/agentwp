<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\HasPage;

class Settings implements Registrable
{
    use HasPage;

    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        $this
            ->pageName('Admin/Settings')
            ->menuName('Agent WP Settings')
            ->registerPage();
    }

    public function onMenuLoad()
    {
    }
}
