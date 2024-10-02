<?php

namespace WpAi\AgentWp\Modules\AwpClient;

class RequestMethod
{
    const GET = 'GET';

    const POST = 'POST';

    const PUT = 'PUT';

    const DELETE = 'DELETE';

    const PATCH = 'PATCH';

    const OPTIONS = 'OPTIONS';

    const HEAD = 'HEAD';

    public static function from(string $method): string
    {
        if (! in_array($method, self::all())) {
            throw new \Exception(esc_html("Invalid request method: $method"));
        }

        return $method;
    }

    public static function tryFrom(string $method): ?string
    {
        try {
            return self::from($method);
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function all()
    {
        return [
            self::GET,
            self::POST,
            self::PUT,
            self::DELETE,
            self::PATCH,
            self::OPTIONS,
            self::HEAD,
        ];
    }
}
