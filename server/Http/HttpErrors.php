<?php

namespace WpAi\AgentWp\Http;

class HttpErrors
{
    private array $errors;

    private HttpError $error;

    public function __construct()
    {
        foreach ($this->errors() as $key => $error) {
            $this->errors[$key] = new HttpError($key, $error['message'], $error['code']);
        }
    }

    private function errors(): array
    {
        return [
            'site_not_connected' => [
                'message' => __('Your site needs to be connected to AgentWP perform this action.', 'agentwp'),
                'code' => 403,
            ],
            'invalid_nonce' => [
                'message' => __('Invalid nonce.', 'agentwp'),
                'code' => 403,
            ],
            'invalid_request' => [
                'message' => __('Invalid request.', 'agentwp'),
                'code' => 400,
            ],
            'api_request_error' => [
                'message' => __('An unknown error occurred.', 'agentwp'),
                'code' => 500,
            ],
            'failed_site_verification' => [
                'message' => __('Your site could not be verified.', 'agentwp'),
                'code' => 403,
            ],
            'access_denied' => [
                'message' => __('Access denied.', 'agentwp'),
                'code' => 403,
            ],
            'not_the_owner' => [
                'message' => __('Only the owner can perform this action.', 'agentwp'),
                'code' => 403,
            ],
        ];
    }

    public function get(string $key): self
    {
        if (! isset($this->errors[$key])) {
            throw new \Exception('Http error key not found');
        }

        $this->error = $this->errors[$key];

        return $this;
    }

    public function toWpError(): \WP_Error
    {
        return new \WP_Error($this->error->key, $this->error->message, [
            'status' => $this->error->code,
        ]);
    }
}

class HttpError
{
    public string $key;

    public string $message;

    public int $code;

    public function __construct(
        string $key,
        string $message,
        int $code
    ) {
        $this->key = $key;
        $this->message = $message;
        $this->code = $code;
    }
}
