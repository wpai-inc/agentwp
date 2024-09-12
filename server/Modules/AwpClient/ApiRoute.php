<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class ApiRoute
{
    public string $key;

    public string $url;

    public string $method;

    public string $name;

    public function __construct(
        string $key,
        string $url,
        string $method
    ) {
        $this->key = $key;
        $this->url = $url;
        $this->method = $method;
        $this->name = $this->nameFromKey($key);
    }

    public function getUrl(string $basePath, array $params = []): string
    {
        $url = $this->hydrateParams($this->url, $params);

        return $basePath.ltrim($url, '/');
    }

    private function hydrateParams(string $url, array $params): string
    {
        foreach ($params as $key => $value) {
            $url = str_replace('{'.$key.'}', $value, $url);
        }

        return $url;
    }

    private function nameFromKey(string $key): string
    {
        $words = preg_split('/[^a-z]/i', $key);

        if (strtolower($words[0]) === 'api') {
            array_shift($words);
        }

        $words = array_map('ucfirst', $words);

        return lcfirst(implode('', $words));
    }
}
