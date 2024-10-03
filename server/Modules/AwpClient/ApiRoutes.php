<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class ApiRoutes
{
    private array $routes;

    public static function fromJson(string $json): self
    {
        $routes = json_decode($json, true);

        return self::fromArray($routes);
    }

    public static function fromArray(array $routes): self
    {
        $instance = new self;
        foreach ($routes as $route) {
            $instance->addRoute(new ApiRoute(
                $route['name'],
                $route['uri'],
                $route['methods'],
            ));
        }

        return $instance;
    }

    public function addRoute(ApiRoute $route): self
    {
        $this->routes[] = $route;

        return $this;
    }

    /**
     * @throws RouteDoesNotExistException
     */
    public function getRoute(string $name): ApiRoute
    {
        foreach ($this->routes as $route) {
            if ($route->name === $name) {
                return $route;
            }
        }

        throw new RouteDoesNotExistException(esc_html($name));
    }

    public function hasRoute(string $name): bool
    {
        return $this->getRoute($name) !== null;
    }
}
