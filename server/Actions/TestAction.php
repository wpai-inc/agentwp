<?php

namespace WpAi\AgentWp\Actions;

class TestAction extends Action
{
    public function __invoke()
    {
        return $this->respond(['success' => true, 'message' => 'AJAX request successful']);
    }
}
