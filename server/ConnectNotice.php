<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class ConnectNotice implements Registrable
{
    private Main $main;

    public function __construct(Main $main)
    {
        $this->main = $main;
    }

    public function register()
    {
        $this->maybeAddInstallNotice();
    }

    private function maybeAddInstallNotice()
    {
        if (! isset($_SERVER['REQUEST_URI'])) {
            return;
        }

        $current_page = \sanitize_url(wp_unslash($_SERVER['REQUEST_URI']));
        if (! $this->main->settings->isConnected() && $current_page === $this->main->settingsPageUrl) {
            add_action('admin_notices', [$this, 'admin_notice_install']);
        }
    }

    public function admin_notice_install()
    {
        ?>
        <div class="notice notice-info is-dismissible agentwp-notice">
            <p><?php esc_html_e('To use AgentWP, please complete the onboarding and configuration!', 'agentwp'); ?></p>
            <a href="<?php echo esc_url($this->main->settingsPageUrl); ?>" class="button button-primary button-large"><?php esc_html_e('Set Up AgentWP', 'agentwp'); ?></a>
        </div>
        <?php
    }
}
