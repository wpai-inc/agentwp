<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class ApiRoute
{
    public string $uri;

    public array $methods;

    public string $name;

    public function __construct(
        string $name,
        string $uri,
        array $methods
    ) {
        $this->name = $name;
        $this->uri = $uri;
        $this->methods = $methods;
    }

    public function getUrl(?array $params = []): array
    {
        return $this->hydrateParams($this->uri, $params);
    }

    public function getMethod(): string
    {
        return $this->methods[0];
    }

    private function hydrateParams(string $url, ?array $params = []): array
    {
        if (! empty($params)) {
            foreach ($params as $key => $value) {
                // Check if the placeholder exists in the URL
                if (strpos($url, '{'.$key.'}') !== false) {
                    // Replace the placeholder with the actual value
                    $url = str_replace('{'.$key.'}', $value, $url);

                    // Remove the used parameter from the array
                    unset($params[$key]);
                }
            }
        }

        // Find any missing parameters still in the URL
        if (preg_match_all('/\{([a-zA-Z1-9]+)\}/', $url, $matches) && ! empty($matches[1])) {
            $missingParamNames = implode(', ', $matches[1]);
            throw new RouteParamsMissingException(esc_html($missingParamNames));
        }

        return [$url, $params];
    }
}
