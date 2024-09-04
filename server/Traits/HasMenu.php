<?php

namespace WpAi\AgentWp\Traits;

trait HasMenu
{
    protected string $menuName;

    protected string $icon;

    protected array $subPages = [];

    protected string $pageHook = '';

    protected int $position = 2;

    public function position(int $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function menuName(string $name): self
    {
        $this->menuName = $name;

        return $this;
    }

    public function subPages(array $pages): self
    {
        if (! $this->main->auth()->hasAccess()) {
            return $this;
        }
        $this->subPages = $pages;

        return $this;
    }

    public function registerMenu()
    {
        add_action('admin_menu', [$this, 'addMenuHandler'], 100);
    }

    public function addMenuHandler()
    {
        $this->pageHook = add_menu_page(
            $this->menuName,
            $this->menuName,
            'manage_options',
            $this->slug(),
            [$this, 'appRoot'],
            $this->icon ?? null,
            $this->position
        );

        foreach ($this->subPages as $page) {
            add_submenu_page(
                $this->slug(),
                $page['name'],
                $page['name'],
                'manage_options',
                $this->slug().'&tab='.$page['slug'],
                [$this, 'appRoot']
            );
        }

        add_action("load-{$this->pageHook}", [$this, 'onMenuLoad']);
    }

    public function onMenuLoad(string $hook)
    {
        //
    }
}
