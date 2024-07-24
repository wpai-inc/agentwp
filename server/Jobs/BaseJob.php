<?php

namespace WpAi\AgentWp\Jobs;

use WpAi\AgentWp\Services\AwpClient;

abstract class BaseJob extends \WP_Async_Request
{
    protected $prefix = 'agentwp';

    protected $awpClient;

    public function __construct()
    {
        parent::__construct();

        $this->awpClient = new AwpClient();
    }

    protected function handleAsync(callable $callback)
    {
        $this->awpClient->setToken($_POST['access_token']);
        $callback($this->awpClient, stripslashes($_POST['data']));
    }
}
