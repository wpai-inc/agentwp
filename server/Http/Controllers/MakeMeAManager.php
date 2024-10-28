<?php

namespace WpAi\AgentWp\Http\Controllers;

class MakeMeAManager extends BaseController
{
    protected string $method = 'POST';

    public function __invoke(): void
    {
        $managers = $this->main->auth->managers();

        if (count($managers) > 0) {
            $this->error('already_have_manager');
        }

        $this->main->auth->makeCurrentUserManager();

        $this->respond(['success' => true]);
    }
}
