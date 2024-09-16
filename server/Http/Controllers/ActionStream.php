<?php

namespace WpAi\AgentWp\Http\Controllers;

use GuzzleHttp\Psr7\Utils;

class ActionStream extends BaseController
{
    protected string $method = 'POST';

    public function __invoke()
    {
        ignore_user_abort(true);

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-store');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');

        // Start output buffering to prevent sending incomplete chunks
        ini_set('zlib.output_compression', 'Off');
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        try {
            $options = [
                'headers' => [
                    'Accept' => 'text/event-stream',
                ],
                'stream' => true,
                'timeout' => 30,
            ];

            $client = $this->main->client()->getClient()->setOptions($options);
            $response = $client->requestStream(
                $this->request->toArray()
            );

            while (! $response->getBody()->eof()) {
                echo Utils::readLine($response->getBody());
                ob_flush();
                flush();
                usleep(50000); // Add a 50ms delay to allow real-time streaming
            }

        } catch (\Exception $e) {
            error_log('STREAM ERROR: '.$e->getMessage());
        }

        // Finish output
        ob_end_flush();
        exit;
    }
}
