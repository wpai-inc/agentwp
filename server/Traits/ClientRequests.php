<?php

namespace WpAi\AgentWp\Traits;

trait ClientRequests
{
    public function getSiteSettings(): ?array
    {
        try {
            return $this->request(
                'GET',
                '/site/settings',
                [],
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function indexSite(string $data): ?array
    {
        try {
            return $this->request(
                'POST',
                '/site/health',
                [],
                $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function summarizeSite(string $data): ?array
    {
        try {
            return $this->request(
                'POST',
                '/site/summarize',
                [],
                $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function indexError($data): ?array
    {
        try {
            return $this->request(
                'POST',
                '/site/errors',
                [],
                $data
            );
        } catch (\Exception $e) {
            // Handle the exception
            error_log($e->getMessage());

            return null;
        }
    }

    public function updateUser($user_id = null): ?array
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
                '/user/wp-user',
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
