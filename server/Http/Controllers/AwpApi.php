<?php

namespace WpAi\AgentWp\Http\Controllers;

class AwpApi extends BaseController
{
    protected string $method = 'POST';

    protected bool $dangerNoNonce = true;

    public function __invoke()
    {
        $data = json_decode($this->request->getContent());
        $endpoint = $data->endpoint;

        try {
            print_r($endpoint);
            exit();
            $response = $this->main->client()->getClient()->$endpoint();
            echo $response->getBody()->getContents();
        } catch (\Exception $e) {
            $this->respondWithError($e->getMessage(), 500);
        }
    }
}
