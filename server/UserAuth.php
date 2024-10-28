<?php

namespace WpAi\AgentWp;

use WP_User;
use WpAi\AgentWp\Http\HttpRequest;

class UserAuth
{
    const CAP_MANAGE_AGENTWP_CONNECTION = 'agentwp_manager';

    const CAP_MANAGE_AGENTWP_USERS = 'manage_agentwp_users';

    const CAP_AGENTWP_ACCESS = 'agentwp_access';

    private Settings $settings;

    private WP_User $user;

    private HttpRequest $request;

    public function __construct($user = null)
    {
        $this->user = $user ?? wp_get_current_user();
        $this->settings = new Settings;
        $this->request = new HttpRequest;
    }

    public function canGenerateVerificationKey(): bool
    {
        if ($this->settings->has('site_id')) {
            return $this->user->has_cap(self::CAP_MANAGE_AGENTWP_CONNECTION);
        }

        return $this->isAdmin();
    }

    public function hasValidVerificationKey(): bool
    {
        $verification_key = $this->request->get('verification_key', true);

        if (empty($verification_key)) {
            return false;
        }

        $local_verification_key = $this->settings->verification_key;

        return ! empty($local_verification_key) && $verification_key === $local_verification_key;
    }

    public function canAccessDB(): bool
    {
        return $this->user->ID > 0 &&
            $this->user->has_cap('administrator') &&
            $this->hasAccess();
    }

    public function isAdmin(): bool
    {
        return in_array($this->getRole(), ['administrator', 'super_admin']);
    }

    public function isManager(): bool
    {
        if ($this->settings->isConnected()) {
            return $this->user->has_cap(self::CAP_MANAGE_AGENTWP_CONNECTION);
        }

        return $this->isAdmin();
    }

    public function wpUserId(): int
    {
        return $this->user->ID;
    }

    public function isAuthenticated(): int
    {
        return ! empty($this->user->ID);
    }

    public function canManageUsers(): bool
    {
        if ($this->settings->isConnected()) {
            return $this->user->has_cap(self::CAP_MANAGE_AGENTWP_USERS);
        }

        return $this->isAdmin();
    }

    public function hasAccess(): bool
    {
        return $this->user->has_cap(self::CAP_AGENTWP_ACCESS) || $this->canManageUsers() || $this->isManager();
    }

    public function getAccessToken(): ?string
    {
        if (! $this->hasAccess()) {
            return null;
        }

        return $this->settings->getAccessToken();
    }

    public function getRefreshToken(): ?string
    {
        if (! $this->hasAccess()) {
            return null;
        }

        return $this->settings->getRefreshToken();
    }

    public function getWpUser()
    {
        return $this->user;
    }

    private function isRole(string $role): bool
    {
        return $this->getRole() === $role;
    }

    private function getRole(): ?string
    {
        return $this->user->roles[0] ?? null;
    }

    public function managers(): array
    {
        return get_users(['role' => 'agentwp_manager']);
    }

    public function addCap(string $cap): void
    {
        $this->user->add_cap($cap);
    }

    public function removeCap(string $cap): void
    {
        $this->user->remove_cap($cap);
    }

    public function makeCurrentUserManager(): void
    {
        $this->addCap(self::CAP_MANAGE_AGENTWP_CONNECTION);
        $this->addCap(self::CAP_MANAGE_AGENTWP_USERS);
        $this->addCap(self::CAP_AGENTWP_ACCESS);
    }
}
