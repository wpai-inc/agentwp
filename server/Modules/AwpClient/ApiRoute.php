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

    public function getUrl(array $params = []): string
    {
        return $this->hydrateParams($this->uri, $params);
    }

    public function getMethod(): string
    {
        return $this->methods[0];
    }

    private function hydrateParams(string $url, array $params): string
    {
        foreach ($params as $key => $value) {
            $url = str_replace('{' . $key . '}', $value, $url);
        }

        $missingParams = [];
        preg_match_all('/\{([a-zA-Z1-9]+)\}/', $url, $missingParams);

        if (! empty($missingParams[1])) {
            $params = implode(', ', $missingParams[1]);
            throw new \Error("You are missing the following params in your request: $params");
        }

        return $url;
    }
}
