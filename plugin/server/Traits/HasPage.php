<?php

namespace WpAi\AgentWp\Traits;

use Idleberg\WordPress\ViteAssets\Assets;

trait HasPage
{
    protected string $pageName;

    protected string $menuName;

    protected string $capability = 'manage_options';

    protected string $pageHook = '';

    public function pageName(string $name): self
    {
        $this->pageName = $name;

        return $this;
    }

    public function menuName(string $name): self
    {
        $this->menuName = $name;

        return $this;
    }

    public function registerPage()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_client_assets']);
        add_filter('admin_body_class', [$this, 'bodyClass']);
        add_action('admin_menu', [$this, 'addMenuHandler'], 100);
        add_filter('update_footer', [$this, 'updateFooter'], 100);
    }

    public function addMenuHandler()
    {
        $this->pageHook = add_submenu_page(
            'options-general.php',
            __($this->menuName, 'agent_wp'),
            __($this->menuName, 'agent_wp'),
            $this->capability,
            $this->slug(),
            [$this, 'body']
        );
        add_action("load-{$this->pageHook}", [$this, 'onMenuLoad']);
    }

    public function onMenuLoad(string $hook)
    {
        //
    }

    public function slug()
    {
        return $this->main::SLUG.'-'.str_replace('/', '-', \strtolower($this->pageName));
    }

    public function bodyClass(string $classes)
    {
        $classes .= ' '.$this->slug();

        return $classes;
    }

    public function clientPage(): string
    {
        return 'Page/'.$this->pageName.'.tsx';
    }

    public function enqueue_client_assets()
    {
        $viteAssets = new Assets($this->main->buildManifestPath(), $this->main->asset());
        $viteAssets->inject($this->clientPage(), [
            'integrity' => false,
        ]);
        $this->registerPageProps();
    }

    private function registerPageProps()
    {
        $slug = $this->slug();
        wp_localize_script($slug, str_replace('-', '_', $slug), $this->pageProps());
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

    public function body()
    {
        ?>
        <noscript>
            <div class="no-js">
                <?php
                    echo esc_html__(
                        'Warning: This options panel will not work properly without JavaScript, please enable it.',
                        'ai-for-wp'
                    );
        ?>
            </div>
        </noscript>
        <style>
            #codewpai-ui-loading {
                height: calc(100vh - 100px);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        </style>
        <div id="agent-wp-loading"><?php echo esc_html__('Loading…', 'agent_wp'); ?></div>
        <div id="agent-wp-root"></div>
        <?php
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
