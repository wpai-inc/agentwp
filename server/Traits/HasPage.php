<?php

namespace WpAi\AgentWp\Traits;

trait HasPage
{
    public function hasFooter(): self
    {
        add_filter('admin_footer_text', [$this, 'updateFooter'], 100);

        return $this;
    }

    public function registerPage()
    {
        $page = $_GET['page'] ?? null;

        if ($this->slug() !== $page) {
            $this->active = false;
        }
    }

    public function updateFooter(): string
    {
        return <<<HTML
            <div style="float: right;">
            Made with love ❤️ by the <a href="{$this->main->attributionUrl}" target="_blank">{$this->main->companyName}</a>
            </div>
        HTML;
    }
}