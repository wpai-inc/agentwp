<?php

namespace WpAi\AgentWp\Http;

use WP_REST_Request;

class HttpRequest
{
    private WP_Rest_Request $request;

    private $content;

    public function __construct(?WP_REST_Request $request = null)
    {
        // If no WP_REST_Request is provided, we create one using the current request globals.
        $this->request = $request ?: new WP_REST_Request($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

        // Populate parameters for `GET` and `POST` (similar to Symfony's `createFromGlobals`).
        $this->request->set_query_params($_GET);
        $this->request->set_body_params($_POST);
        $this->request->set_headers($this->headersFromGlobals($_SERVER));
        $this->request->set_body($this->getContent());
    }

    /**
     * Returns the request body content.
     *
     * @param  bool  $asResource  If true, a resource will be returned
     * @return string|resource
     */
    public function getContent(bool $asResource = false)
    {
        $currentContentIsResource = \is_resource($this->content);

        if ($asResource === true) {
            if ($currentContentIsResource) {
                rewind($this->content);

                return $this->content;
            }

            // Content passed in parameter (test)
            if (\is_string($this->content)) {
                $resource = fopen('php://temp', 'r+');
                fwrite($resource, $this->content);
                rewind($resource);

                return $resource;
            }

            $this->content = false;

            return fopen('php://input', 'r');
        }

        if ($currentContentIsResource) {
            rewind($this->content);

            return stream_get_contents($this->content);
        }

        if ($this->content === null || $this->content === false) {
            $this->content = file_get_contents('php://input');
        }

        return $this->content;
    }

    private function headersFromGlobals(array $server)
    {
        $headers = [];
        foreach ($server as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $headers[str_replace('HTTP_', '', $key)] = $value;
            }
        }

        return $headers;
    }

    public function getMethod()
    {
        return $this->request->get_method();
    }

    public function get($name, $sanitize = false, $default = null)
    {
        $value = $this->request->get_param($name) ?: $default;

        if ($sanitize) {
            return sanitize_text_field(wp_unslash($value));
        }

        return $value;
    }

    public function getJsonContent($key = null, $associative = true)
    {
        $content = $this->request->get_body();
        $data = json_decode($content, $associative);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        if ($key && isset($data[$key])) {
            return $data[$key];
        }

        return $data;
    }

    public function getHeader($name, $default = null)
    {
        $headers = $this->request->get_headers();

        return $headers[$name][0] ?? $default;
    }

    public function toArray(): array
    {
        return $this->getJsonContent();
    }

    public function all()
    {
        return array_merge($this->request->get_query_params(), $this->request->get_body_params());
    }

    public function getClientIp()
    {
        return $_SERVER['REMOTE_ADDR'] ?? null;
    }
}
