<?php

namespace WpAi\AgentWp\Http\Controllers;

class AwpApi extends BaseController
{
    protected string $method = 'POST';

    public function __invoke()
    {
        $params = json_decode($this->request->getContent(), true);
        $endpoint = $params['endpoint'];
        unset($params['endpoint']);

        return $this->main->client()->$endpoint($params);
    }
}
