<?php

namespace WpAi\AgentWp\Http\Controllers;

class MakeMeAManager extends BaseController
{
    protected string $method = 'POST';

    public function __invoke(): void
    {
        $user_settings = $this->main->client()->user();
        $isOwner = $user_settings['user']['email'] === wp_get_current_user()->user_email;

        if (! $isOwner) {
            $this->error('not_the_owner');
        }

        $this->main->auth->makeCurrentUserManager();

        $this->respond(['success' => true]);
    }
}
