<?php

namespace WpAi\AgentWp;

use Kucrut\Vite;
use WpAi\AgentWp\Contracts\ClientBodyInterface;
use WpAi\AgentWp\Contracts\Registrable;

abstract class ReactClient implements ClientBodyInterface, Registrable
{
    protected string $pageName;

    protected bool $active = true;

    public function __construct(protected Main $main)
    {
        $this->pageName =
        str_replace('\\', '/', str_replace(__NAMESPACE__.'\\Page\\', '', get_class($this)));
    }

    /**
     * Extra things to register after client assets
     * have been enqueued
     */
    abstract public function registrations(): void;

    /**
     * Register the client and anything else.
     */
    public function register()
    {
        $this->registrations();

        if ($this->active) {
            add_action('admin_enqueue_scripts', [$this, 'enqueue_client_assets']);
            add_filter('admin_body_class', [$this, 'bodyClass']);
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
        return 'Page/'.$this->pageName.'.tsx';
    }

    /**
     * Unique page slug
     */
    public function slug()
    {
        return $this->main::SLUG.'-'.str_replace('/', '-', \strtolower($this->pageName));
    }

    /**
     * Adds a class to the body tag
     */
    public function bodyClass(string $classes)
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

    public function body(): void
    {
        ?>
        <noscript>
            <div class="no-js">
            <?php
                echo esc_html__(
                    'Warning: Agent WP will not work properly without JavaScript, please enable it.',
                    'agent-wp'
                );
        ?>
            </div>
        </noscript>
        <div id="<?php echo $this->slug() ?>"></div>
        <?php
    }
}
