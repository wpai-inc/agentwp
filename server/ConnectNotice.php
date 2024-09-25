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
        $current_page = esc_url_raw($_SERVER['REQUEST_URI']);
        if (! $this->main->settings->isConnected() && $current_page === $this->main->settingsPageUrl) {
            add_action('admin_notices', [$this, 'admin_notice_install']);
        }
    }

    public function admin_notice_install()
    {
        ?>
        <div class="notice notice-info is-dismissible agentwp-notice">
            <p><?php _e('To use AgentWP, please complete the onboarding and configuration!', 'agentwp'); ?></p>
            <a href="<?php echo $this->main->settingsPageUrl; ?>" class="button button-primary button-large"><?php _e('Set Up AgentWP', 'agentwp'); ?></a>
        </div>
        <style>
            .agentwp-notice {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                padding: 1rem;
                background-color: #f8f9fa;
                border-radius: 0.25rem;
                color: #495057;
            }
        </style>
<?php
    }
}
