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
            // Translators: %1$s is the invalid request method.
            throw new \Exception(esc_html(sprintf(__('Invalid request method: %1$s', 'agentwp'), $method)));
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
