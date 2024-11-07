<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class ClientResponse
{
    private int $status;

    private string $body;

    private array $headers;

    public function __construct(int $status, string $body, array $headers = [])
    {
        $this->status = $status;
        $this->body = $body;
        $this->headers = $headers;
    }

    public function body(): string
    {
        return $this->body;
    }

    public function status(): int
    {
        return $this->status;
    }

    public function isError(): bool
    {
        return $this->status >= 400;
    }
}
