<?php

namespace WpAi\AgentWp\Http\Controllers;

use GuzzleHttp\Client;

class TestResponse extends BaseController
{
    public function successfulResponse(): void
    {
        $key = uniqid('agentwp-', true);
        $this->main->settings->set('verification_key', $key);

        $this->respond([
            'key' => $key,
            'home_url' => home_url(),
            'foo' => $this->request->get('foo'),
        ]);
    }

    /**
     * Stream the response using Guzzle
     */
    public function stream()
    {
        // Set headers to make sure the response is treated as a stream
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');

        // Start output buffering to prevent sending incomplete chunks
        ob_start();

        // Create a Guzzle client instance
        $client = new Client;

        try {
            // Make a GET request to the external streaming endpoint
            $response = $client->request('GET', $this->main->client()->getApiBaseUri().'stream/test', [
                'headers' => [
                    'Accept' => 'text/event-stream',
                ],
                'stream' => true,
                'timeout' => 30, // Adjust timeout as needed
            ]);

            // Get the body of the response as a stream
            $body = $response->getBody();

            // Loop over the stream and echo chunks to the client
            while (! $body->eof()) {
                echo esc_html($body->read(1024)); // Read in chunks of 1024 bytes and escape output

                // Flush the output buffer to send the data immediately
                ob_flush();
                flush();
            }
        } catch (\Exception $e) {
            // Handle errors appropriately
            echo 'Error: '.esc_html($e->getMessage());
        }

        // Finish output
        ob_end_flush();
        exit;
    }
}
