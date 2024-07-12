<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Services\AwpClient;
use WpAi\AgentWp\Services\Cache;

class SiteSummarizer implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        add_action('admin_init', [$this, 'send']);
    }

    public function send()
    {
        if ($this->main->siteId()) {
            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }

            $cache = new Cache('summary', $this->getDataForSummarization());
            if ($cache->miss()) {
                (new AwpClient($this->main, false))->summarizeSite(json_encode($cache->getData()));
            }
        }
    }

    private function getDataForSummarization(): array
    {
        return ['some sample data'];
    }
}
