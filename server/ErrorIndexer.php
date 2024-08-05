<?php

namespace WpAi\AgentWp;

use WpAi\AgentWp\Contracts\Registrable;

/**
 * Temporary for demo, poor performance
 * and security implications.
 */
class ErrorIndexer implements Registrable
{
    private Main $main;
    public function __construct(Main $main)
    {
        $this->main = $main;
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
        $siteId = $this->main->siteId();
        $token = $this->main->settings->getAccessToken();
        if (!$siteId || !$token) {
            return false;
        }

        if ($error_level === E_NOTICE || $error_level === E_DEPRECATED || $error_level === E_USER_DEPRECATED || $error_level === E_USER_NOTICE || $error_level === E_STRICT) {
            return false;
        }

        $error_data = [
            'level' => $error_level,
            'message' => $error_message,
            'file' => $error_file,
            'line' => $error_line,
            'context' => $error_context, // Be cautious with sensitive information
        ];
        $hash = md5(json_encode($error_data));

        $logged_errors = get_transient('agentwp_errors');
        if ($logged_errors && isset($logged_errors[$hash])) {
            return false;
        }

        if (!$logged_errors) {
            $logged_errors = [];
        }

        $logged_errors = [$hash => $error_data] + $logged_errors;

        $logged_errors = array_slice($logged_errors, 0, 10, true);

        set_transient('agentwp_errors', $logged_errors, 60); // 1 minute (for debugging purposes)
        $this->sendTheErrors($error_data);

        return false; // Let PHP handle the error as well
    }

    private function sendTheErrors($error_data): void
    {
        $this->main->client(false)->indexError(json_encode($error_data));
    }
}
