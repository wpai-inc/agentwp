<?php

namespace WpAi\AgentWp\Controllers;

class QueryActionController extends BaseController
{
    public function query(): void
    {
        $this->hasAccessToDatabase();

        global $wpdb;

        // unescape slashes
        $sql = stripslashes($this->request->query->get('sql'));

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
            'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REPLACE', 'DROP', 'ALTER', 'CREATE',
            'GRANT', 'REVOKE', 'LOCK', 'UNLOCK', 'LOAD DATA', 'MERGE', 'SET', 'CALL', 'EXECUTE',
            'DO', 'HANDLER', 'RENAME', 'ANALYZE', 'OPTIMIZE', 'REPAIR', 'BACKUP', 'RESTORE',
            'PURGE', 'RESET', 'START', 'STOP', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
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

    private function hasAccessToDatabase()
    {
        // user should be authenticated and to be an admin
        $user = wp_get_current_user();
        if ($user->ID === 0 || ! $user->has_cap('administrator') || !$this->main->auth->hasAccess()) {
            throw new \Exception('You do not have access to the database');
        }

        return true;
    }
}
