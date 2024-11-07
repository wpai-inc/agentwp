<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class ClientResponse
{
    private int $status;

    private string $body;

    private array $headers;

    private $error = null;

    public function __construct(int $status, string $body, array $headers = [])
    {
        $this->status = $status;
        $this->body = $body;
        $this->headers = $headers;
    }

    /**
     * @return array|\WP_Error
     */
    public function get()
    {
        if ($this->error) {
            return $this->error;
        } else {
            return json_decode($this->body, true);
        }
    }

    public function status(): int
    {
        return $this->status;
    }

    public function isError(): bool
    {
        return $this->status > 400;
    }

    public function setErrorResponse($error): self
    {
        $this->error = $error;

        return $this;
    }
}
