<?php

namespace WpAi\AgentWp\Http\Controllers;

class AwpApi extends BaseController
{
    protected string $method = 'POST';

    public function __invoke()
    {
        $data = json_decode($this->request->getContent(), true);
        $endpoint = $data['endpoint'];
        unset($data['endpoint']);
        $params = $data;

        return $this->main->client()->$endpoint($params);
    }
}
