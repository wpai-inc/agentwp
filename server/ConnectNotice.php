<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

class ConnectNotice implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        $this->maybeAddInstallNotice();
    }

    private function maybeAddInstallNotice()
    {
        $current_page = $_SERVER['REQUEST_URI'];
        if (!$this->main->settings->isConnectedToAwp() && strpos($current_page, 'options-general.php?page=agent-wp-admin-settings') === false) {
            add_action('admin_notices', [$this, 'admin_notice_install']);
        }
    }

    public function admin_notice_install()
    {
        ?>
        <div class="notice notice-info is-dismissible agentwp-notice">
            <p><?php _e('To use AgentWP, please complete the onboarding and configuration!', 'agentwp'); ?></p>
            <a href="<?php echo admin_url('options-general.php?page=agent-wp-admin-settings'); ?>" class="button button-primary button-large"><?php _e('Set Up AgentWP', 'agentwp'); ?></a>
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
