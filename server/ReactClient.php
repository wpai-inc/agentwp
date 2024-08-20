<?php

namespace WpAi\AgentWp;

use Kucrut\Vite;
use WpAi\AgentWp\Contracts\ClientAppInterface;
use WpAi\AgentWp\Contracts\Registrable;

abstract class ReactClient implements ClientAppInterface, Registrable
{
    protected string $pageName;

    protected bool $active = true;

    protected Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->pageName =
            str_replace('\\', '/', str_replace(__NAMESPACE__.'\\Page\\', '', get_class($this)));
    }

    /**
     * Extra things to register after client assets
     * have been enqueued
     */
    abstract public function registrations(): void;

    public function active(): bool
    {
        return true;
    }

    /**
     * Register the client and anything else.
     */
    public function register()
    {
        $this->registrations();

        if ($this->active()) {
            add_action('admin_enqueue_scripts', [$this, 'enqueue_client_assets']);
            add_action('elementor/editor/after_enqueue_scripts', [$this, 'enqueue_client_assets'], 100);

            add_action('admin_enqueue_scripts', [$this, 'registerPageProps']);
            add_action('elementor/editor/after_enqueue_scripts', [$this, 'registerPageProps'], 101);

            add_filter('admin_body_class', [$this, 'bodyClass']);
            add_action('wp_ajax_'.$this->slug('_'), [$this, 'registerControllers']);
        }
    }

    public function setPageName(string $name): self
    {
        $this->pageName = $name;

        return $this;
    }

    /**
     * Entrypoint to the Client Page
     */
    public function clientPage(): string
    {
        return 'Page/'.$this->pageName.'/Index.tsx';
    }

    /**
     * Unique page slug
     */
    public function slug($sep = '-'): string
    {
        return str_replace('-', $sep, $this->main::SLUG).$sep.str_replace('/', $sep, \strtolower($this->pageName));
    }

    /**
     * Adds a class to the body tag
     */
    public function bodyClass(string $classes): string
    {
        $classes .= ' '.$this->slug();

        return $classes;
    }

    public function enqueue_client_assets()
    {
        Vite\enqueue_asset(
            $this->main->buildPath(),
            $this->clientPage(),
            [
                'dependencies' => ['react', 'react-dom'],
                'handle' => $this->slug(),
                'in-footer' => true,
            ]
        );
    }

    public function appRoot(): void
    {
        ?>
        <script>
            // add body classes
            document.body.classList.add('<?php echo $this->slug() ?>');
        </script>
        <noscript>
            <div class="no-js">
                <?php
                        echo esc_html__(
                            'Warning: Agent WP will not work properly without JavaScript, please enable it.',
                            'agentwp'
                        );
        ?>
            </div>
        </noscript>
        <div id="<?php echo $this->slug() ?>"></div>
<?php
    }

    public function pageProps(): array
    {
        $merge = $this->data();

        return [
            'page' => $this->slug(),
            'url' => $this->main->url(),
            'notice_visible' => boolval(get_option('codewpai_notice_visible', 1)),
            ...$merge,
        ];
    }

    public function registerPageProps()
    {
        wp_localize_script($this->slug('-'), $this->slug('_'), $this->pageProps());
    }

    public function registerControllers()
    {
        // Check the nonce for security
        check_ajax_referer('my-plugin-ajax-nonce', 'nonce');

        // Perform your AJAX action here
        $response = ['success' => true, 'message' => 'AJAX request successful'];

        // Return the response
        wp_send_json_success($response);
    }
}
