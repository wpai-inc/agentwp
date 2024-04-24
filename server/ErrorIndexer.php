<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

/**
 * Temporary for demo, poor performance
 * and security implications.
 */
class ErrorIndexer implements Registrable
{
    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        set_error_handler([$this, 'handle']);
        register_shutdown_function([$this, 'catchFatalErrors']);
    }

    public function catchFatalErrors()
    {
        $last_error = error_get_last();
        if ($last_error && ($last_error['type'] === E_ERROR || $last_error['type'] === E_PARSE)) {
            $this->handle($last_error['type'], $last_error['message'], $last_error['file'], $last_error['line'], []);
        }
    }

    public function handle(
        int $error_level,
        string $error_message,
        string $error_file,
        int $error_line,
        array $error_context = []
    ): bool {
        $error_data = [
            'level' => $error_level,
            'message' => $error_message,
            'file' => $error_file,
            'line' => $error_line,
            'context' => $error_context, // Be cautious with sensitive information
        ];

        $response = wp_remote_post("http://laravel.test/api/sites/{$this->main->siteId}/index/errors", [
            'body' => json_encode($error_data),
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);

        return false; // Let PHP handle the error as well
    }
}