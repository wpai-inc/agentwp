<?php

namespace WpAi\AgentWp\Traits;

use Psr\Http\Message\ResponseInterface;

trait ClientRequests
{
    public function indexSite($data): ?ResponseInterface
    {
        try {
            return $this->request(
                method: 'POST',
                url: "{$this->main->apiHost()}/api/sites/index/health",
                body: $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function indexError($data): ?ResponseInterface
    {
        try {
            return $this->request(
                method: 'POST',
                url: "{$this->main->apiHost()}/api/sites/index/errors",
                body: $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function updateUser(array $data): ?ResponseInterface
    {
        try {
            return $this->request(
                method: 'POST',
                url: "{$this->main->apiHost()}/api/user/wp-user",
                body: $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }
}
