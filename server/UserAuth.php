<?php

namespace WpAi\AgentWp;

use WP_User;

class UserAuth
{
    private Settings $settings;

    public function __construct(private WP_User $user)
    {
        $this->settings = new Settings();
    }

    public function isAdmin(): bool
    {
        return in_array($this->getRole(), ['administrator', 'super_admin']);
    }

    public function isManager(): bool
    {
        return true;
        if ($this->settings->has('site_id') && $this->isRole('administrator')) {
            return true;
        }

        return current_user_can('agentwp_manager');
    }

    public function wpUserId(): int
    {
        return $this->user->ID;
    }

    public function canManageUsers(): bool
    {
        return true;
        if ($this->settings->has('site_id') && $this->isRole('administrator')) {
            return true;
        }

        return current_user_can('manage_agentwp_users') || $this->isManager();
    }

    public function hasAccess(): bool
    {
        return current_user_can('agentwp_access') || $this->canManageUsers() || $this->isManager();
    }

    public function getAccessToken(): ?string
    {
        if (! $this->hasAccess()) {
            return null;
        }

        $token = $this->settings->getAccessToken();

        return $token['access_token'] ?? null;
    }

    private function isRole(string $role): bool
    {
        return $this->getRole() === $role;
    }

    private function getRole(): ?string
    {
        return $this->user->roles[0] ?? null;
    }
}
