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

    public function createRequest()
    {
        $response = $this->main->client()->convoCreate($this->request->toArray());

        $response['access_token'] = $this->main->getAccessToken();

        $this->respond($response);
    }

    public function retryRequest()
    {
        error_log(print_r($this->request->toArray(), true));
        $response = $this->main->client()->requestRetry($this->request->toArray());

        $response['access_token'] = $this->main->getAccessToken();

        $this->respond($response);
    }
}
