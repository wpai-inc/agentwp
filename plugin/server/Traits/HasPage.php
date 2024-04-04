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
        add_action('admin_menu', [$this, 'addMenuHandler'], 100);
        add_action('admin_enqueue_scripts', [$this, 'registerPageProps']);
    }

    public function pageProps(array $merge = []): array
    {
        return [
            'nonce' => wp_create_nonce($this->main::nonce()),
            'url' => $this->main->url(),
            'notice_visible' => get_option('codewpai_notice_visible', 1),
            ...$merge,
        ];
    }

    public function updateFooter(): string
    {
        return <<<HTML
            <div style="float: right;">
            Made with love ❤️ by the <a href="{$this->main->attributionUrl}" target="_blank">{$this->main->companyName}</a>
            </div>
        HTML;
    }

    public function registerPageProps()
    {
        $slug = $this->slug();
        wp_localize_script($slug, str_replace('-', '_', $slug), $this->pageProps());
    }
}
