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

    public function getUrl(?array $params = []): string
    {
        return $this->hydrateParams($this->uri, $params);
    }

    public function getMethod(): string
    {
        return $this->methods[0];
    }

    private function hydrateParams(string $url, ?array $params = []): string
    {
        if ($params) {
            foreach ($params as $key => $value) {
                if (is_string($value)) {
                    $url = str_replace('{' . $key . '}', $value, $url);
                }
            }
        }

        $missingParams = [];
        preg_match_all('/\{([a-zA-Z1-9]+)\}/', $url, $missingParams);

        if (! empty($missingParams[1])) {
            throw new RouteParamsMissingException($missingParams[1]);
        }

        return $url;
    }
}
