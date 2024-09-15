<?php

namespace WpAi\AgentWp\Http\Controllers;

class ActionStream extends BaseController
{
    protected string $method = 'POST';

    public function __invoke()
    {
        print_r($this->request->toArray(), true);

        ignore_user_abort(true);

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-store');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');

        ob_start();

        try {
            $options = [
                'headers' => [
                    'Accept' => 'text/event-stream',
                ],
                'stream' => true,
                'timeout' => 30,
            ];

            error_log(print_r([
                'userRequest' => $this->request->get('userRequest'),
                'screen' => $this->request->get('screen'),
            ], true));
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
            error_log('Error: '.$e->getMessage());
            echo 'Error: '.$e->getMessage();
        }

        // Finish output
        ob_end_flush();
        exit;
    }
}
