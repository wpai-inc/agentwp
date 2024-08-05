<?php

namespace WpAi\AgentWp\Traits;

use Psr\Http\Message\ResponseInterface;

trait ClientRequests
{
    public function indexSite(string $data): ?ResponseInterface
    {
        try {
            return $this->request(
                'POST',
                "{$this->apiHost}/api/site/health",
                [],
                $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function summarizeSite(string $data): ?ResponseInterface
    {
        try {
            return $this->request(
                'POST',
                "{$this->apiHost}/api/site/summarize",
                [],
                $data
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
                'POST',
                "{$this->apiHost}/api/site/errors",
                [],
                $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function updateUser($user_id = null): ?ResponseInterface
    {
        if ($user_id) {
            $user = get_user_by('ID', $user_id);
        } else {
            $user = wp_get_current_user();
        }

        $data = [
            'display_name' => $user->display_name,
            'nicename' => $user->user_nicename,
            'role' => $user->roles[0],
        ];

        try {
            return $this->request(
                'PUT',
                "{$this->apiHost}/api/user/wp-user",
                [],
                json_encode($data)
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }
}
