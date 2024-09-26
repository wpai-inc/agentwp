<?php

namespace WpAi\AgentWp\Http\Controllers;

class QueryActionController extends BaseController
{
    public function __invoke(): void
    {
        if (! $this->main->auth->canAccessDB()) {
            $this->error('access_denied');
            exit;
        }

        global $wpdb;

        // unescape slashes
        $sql = stripslashes($this->request->query->get('sql'));

        // validate query and only accept SELECT queries
        if (preg_match('/\b(INSERT|UPDATE|DELETE)\b/i', $sql)) {
            $this->error('Only SELECT queries are allowed. The query was: '.$sql, 422);
        }

        try {
            $args = $this->request->query->all('args');
        } catch (\Exception $e) {
            $args = [];
        }

        $prepared_query = $wpdb->prepare($sql, $args);

        $prepared_query = $this->filterSqlQuery($prepared_query);

        $results = $wpdb->get_results($prepared_query);

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

        // Check for disallowed keywords
        foreach ($disallowedKeywords as $keyword) {
            if (strpos($uppercaseSQL, $keyword) !== false) {
                throw new \Exception("Query contains disallowed keyword: $keyword");
            }
        }

        // Additional checks
        if (preg_match('/;\s*\w/', $sql)) {
            throw new \Exception('Multiple statements are not allowed');
        }

        if (! preg_match('/^\s*SELECT\b/i', $sql)) {
            throw new \Exception('Query must start with SELECT');
        }

        // If all checks pass, return the original query
        return $sql;
    }
}
