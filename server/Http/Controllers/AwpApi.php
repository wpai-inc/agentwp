<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Traits\HasMentions;

class AwpApi extends BaseController
{
    use HasMentions;

    protected string $method = 'POST';

    public function __invoke()
    {
        $params = $this->request->getJsonContent();
        $endpoint = $params['endpoint'];
        unset($params['endpoint']);

        return $this->main->client()->$endpoint($params);
    }

    public function createRequest()
    {
        $response = $this->main->client()->convoCreate($this->handleMentions($this->request->toArray()));

        if (\is_wp_error($response)) {
            $this->respondWithError($response->get_error_message(), $response->get_error_code());
        }

        $response['access_token'] = $this->main->getAccessToken();

        $this->respond($response);
    }

    public function retryRequest()
    {
        $response = $this->main->client()->requestRetry($this->request->toArray());

        $response['access_token'] = $this->main->getAccessToken();

        $this->respond($response);
    }
}
