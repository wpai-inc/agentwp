<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class ApiRoutes
{
    private array $routes;

    public static function fromArray(array $routes): self
    {
        $instance = new self;
        foreach ($routes as $key => $route) {
            $method = RequestMethod::from($route['method']);
            $instance->addRoute(new ApiRoute($key, $route['url'], $method));
        }

        return $instance;
    }

    public function addRoute(ApiRoute $route): self
    {
        $this->routes[] = $route;

        return $this;
    }

    public function getRoute(string $name): ApiRoute
    {
        foreach ($this->routes as $route) {
            if ($route->name === $name) {
                return $route;
            }
        }

        throw new \Exception("Route $name not found");
    }

    public function hasRoute(string $name): bool
    {
        return $this->getRoute($name) !== null;
    }
}
