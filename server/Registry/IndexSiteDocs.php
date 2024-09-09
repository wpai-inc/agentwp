<?php

namespace WpAi\AgentWp\Registry;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Modules\SiteDocs\IndexStatus;
use WpAi\AgentWp\Modules\SiteDocs\SiteDocs;
use WpAi\AgentWp\Traits\HasCache;
use WpAi\AgentWp\Traits\HasScheduler;

class IndexSiteDocs implements Registrable
{
    use HasCache, HasScheduler;

    private Main $main;

    private SiteDocs $docs;

    public function __construct(Main $main)
    {
        $this->main = $main;
        $this->docs = new SiteDocs;
    }

    public function register(): void
    {
        // $this->registerActionSchedules(['autoUpdate']);
        // add_action('wp', [$this, 'run']);
    }

    public function autoUpdate(): void
    {
        if (! $this->main->siteId() || (defined('DOING_AJAX') && DOING_AJAX)) {
            return;
        }
        $data = $this->docs->data();
        $cache = $this->cache($this->docs->data());

        if (! $cache->hit()) {
            $this->send($cache->getData());
        }
    }

    public function run(): void
    {
        while ($this->docs->inprogress()) {
            $success = $this->send();
            if (! $success) {
                break;
            }
        }
    }

    public function send(): bool
    {
        $status = IndexStatus::get();
        $this->docs->setStatus($status);

        $response = $this->main->client(false)->indexDocs(
            $this->docs->data()
        );

        if (isset($response['error'])) {
            error_log(print_r($response['error'], true));

            return false;
        }

        $updatedStatus = IndexStatus::fromArray($response);

        if ($updatedStatus->same($status)) {
            return false;
        }

        return $updatedStatus->update();
    }
}
