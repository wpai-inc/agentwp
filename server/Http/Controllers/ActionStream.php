<?php

namespace WpAi\AgentWp\Http\Controllers;

class ActionStream extends BaseController
{
    protected string $method = 'POST';

    public function __invoke()
    {
        // Set headers to make sure the response is treated as a stream
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');

        ob_start();

        try {
            $options = [
                'headers' => [
                    'Accept' => 'text/event-stream',
                ],
                'stream' => true,
                'timeout' => 30,
            ];

            $client = $this->main->client()->getClient();
            $response = $client->setOptions($options)->requestStream([
                'userRequest' => $this->request->get('userRequest'),
                'screen' => $this->request->get('screen'),
            ]);

            $body = $response->getBody();

            while (! $body->eof()) {
                echo $body->read(1024); // Read in chunks of 1024 bytes
                ob_flush();
                flush();
            }
        } catch (\Exception $e) {
            echo 'Error: '.$e->getMessage();
        }

        // Finish output
        ob_end_flush();
        exit;
    }
}
