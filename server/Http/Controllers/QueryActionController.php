<?php

namespace WpAi\AgentWp\Http\Controllers;

class QueryActionController extends BaseController
{
    protected string $method = 'POST';

    public function __invoke(): void
    {
        if (! $this->main->auth->canAccessDB()) {
            $this->error('access_denied');
            exit;
        }

        global $wpdb;

        // unescape slashes
        $request = $this->request->getJsonContent();
        $sql = stripslashes($request['sql']);
        $sql = $this->filterSqlQuery($sql);

        $args = $request['args'] ?? [];

        $results = $wpdb->get_results($wpdb->prepare($sql, $args), ARRAY_A);

        if ($wpdb->last_error) {
            $this->respondWithError($wpdb->last_error, 422);
        } else {
            $this->respond([
                'results' => $results,
            ]);
        }
    }

    private function filterSqlQuery($sql)
    {
        // Convert the query to uppercase for case-insensitive matching
        $uppercaseSQL = strtoupper($sql);

        // List of disallowed keywords
        $disallowedKeywords = [
            'INSERT',
            'UPDATE',
            'DELETE',
            'TRUNCATE',
            'REPLACE',
            'DROP',
            'ALTER',
            'CREATE',
            'GRANT',
            'REVOKE',
            'LOCK',
            'UNLOCK',
            'LOAD DATA',
            'MERGE',
            'SET',
            'CALL',
            'EXECUTE',
            'DO',
            'HANDLER',
            'RENAME',
            'ANALYZE',
            'OPTIMIZE',
            'REPAIR',
            'BACKUP',
            'RESTORE',
            'PURGE',
            'RESET',
            'START',
            'STOP',
            'COMMIT',
            'ROLLBACK',
            'SAVEPOINT',
        ];
        $foundDisallowedKeywords = [];
        // Check for disallowed keywords
        foreach ($disallowedKeywords as $keyword) {
            if (preg_match('/\b'.preg_quote($keyword, '/').'\b/', $uppercaseSQL)) {
                $foundDisallowedKeywords[] = $keyword;
            }
        }

        if (! empty($foundDisallowedKeywords)) {
            // Translators: %1$s is a list of disallowed SQL keywords found in the query.
            throw new \Exception(esc_html(printf(__('Query contains disallowed keyword: %1$s', 'agentwp'), implode(', ', $foundDisallowedKeywords))));
        }

        // Additional checks
        if (preg_match('/;\s*\w/', $sql)) {
            throw new \Exception(esc_html__('Multiple statements are not allowed', 'agentwp'));
        }

        if (! preg_match('/^\s*SELECT\b/i', $sql)) {
            throw new \Exception(esc_html__('Query must start with SELECT', 'agentwp'));
        }

        // If all checks pass, return the original query
        return $sql;
    }
}
