<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class ProviderRegistry
{
    private Main $main;

    private array $providers = [
        \WpAi\AgentWp\Page\Admin\Settings::class,
        \WpAi\AgentWp\Page\Admin\Chat::class,
        \WpAi\AgentWp\Page\Admin\DashboardWidget::class,
        \WpAi\AgentWp\Page\Frontend\Chat::class,
        \WpAi\AgentWp\Registry\Hooks::class,
        \WpAi\AgentWp\Registry\CodeRunner::class,
        \WpAi\AgentWp\Registry\IndexSiteData::class,
        \WpAi\AgentWp\Registry\IndexSiteSummary::class,
        \WpAi\AgentWp\Registry\IndexThemeJson::class,
        \WpAi\AgentWp\Registry\IndexSiteDocs::class,
        \WpAi\AgentWp\Registry\Router::class,
        \WpAi\AgentWp\Registry\WpUser::class,
    ];

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    /**
     * @throws \Exception
     */
    public function register()
    {
        foreach ($this->providers as $class) {
            if (! class_exists($class)) {
                // Translators: %1$s is the class name that does not exist.
                throw new \Exception(esc_html(sprintf(__('Class %1$s does not exist', 'agentwp'), $class)));
            }

            if (! is_a($class, Registrable::class, true)) {
                // Translators: %1$s is the class name that does not implement Registrable.
                throw new \Exception(esc_html(sprintf(__('Class %1$s does not implement Registrable', 'agentp'), $class)));
            }

            (new $class($this->main))->register();
        }
    }
}
