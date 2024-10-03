<?php

namespace WpAi\AgentWp\Http;

use Symfony\Component\HttpFoundation\Request;

class HttpRequest
{
    private $theRequest;

    public function __construct()
    {
        $this->theRequest = Request::createFromGlobals();
    }

    public function getMethod()
    {
        return $this->theRequest->getMethod();
    }

    public function get($name, $sanitize = false, $default = null)
    {
        $value = $this->theRequest->query->get($name, $default);

        if ($sanitize) {
            return sanitize_text_field(wp_unslash($value));
        }

        return $value;
    }

    public function post($name, $default = null)
    {
        return $this->theRequest->request->get($name, $default);
    }

    public function getContent()
    {
        return $this->theRequest->getContent();
    }

    public function getJsonContent($key = null, $associative = true)
    {
        $val = json_decode($this->getContent(), $associative);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        if ($key) {
            return $val[$key];
        }

        return $val;
    }

    public function getHeader($name, $default = null)
    {
        return $this->theRequest->headers->get($name, $default);
    }

    public function toArray()
    {
        return $this->theRequest->toArray();
    }

    public function all($name)
    {
        return $this->theRequest->query->all($name);
    }

    public function getClientIp()
    {
        return $this->theRequest->getClientIp();
    }
}
