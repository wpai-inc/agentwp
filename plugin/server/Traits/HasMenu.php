<?php

namespace WpAi\AgentWp\Traits;

trait HasMenu
{
    protected string $menuName;

    protected string $pageHook = '';

    public function menuName(string $name): self
    {
        $this->menuName = $name;

        return $this;
    }

    public function registerMenu()
    {
        add_action('admin_menu', [$this, 'addMenuHandler'], 100);
    }

    public function addMenuHandler()
    {
        $this->pageHook = add_submenu_page(
            'options-general.php',
            __($this->menuName, 'agent_wp'),
            __($this->menuName, 'agent_wp'),
            'manage_options',
            $this->slug(),
            [$this, 'body']
        );
        add_action("load-{$this->pageHook}", [$this, 'onMenuLoad']);
    }

    public function onMenuLoad(string $hook)
    {
        //
    }
}
