<?php

namespace WpAi\AgentWp\Traits;

trait HasPage
{
    public function hasFooter(): self
    {
        add_filter('admin_footer_text', [$this, 'updateFooter'], 100);

        return $this;
    }

    public function updateFooter(): string
    {
        return sprintf('<div style="float: right; padding-left: 12px">
            Made with love ❤️ by the <a href="%s" target="_blank">%s</a>
            </div>', \esc_attr($this->main->attributionUrl), esc_html($this->main->companyName));
    }
}
