<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\ReactClient;
use WpAi\AgentWp\Traits\HasMenu;
use WpAi\AgentWp\Traits\HasPage;

class Settings extends ReactClient
{
    use HasMenu, HasPage;

    public function registrations(): void
    {
        $this->hasFooter()->registerPage();
        $this->menuName('Agent WP Settings')->registerMenu();
    }
}
