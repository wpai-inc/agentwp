<?php

namespace WpAi\AgentWp\Http\Controllers;

// use WpAi\AgentWp\Services\Db;

class QueryActionController extends BaseController
{
    public function __invoke(): void
    {
        // if (! $this->main->auth->canAccessDB()) {
        //     $this->error('access_denied');
        //     exit;
        // }

        // global $wpdb;

        // // unescape slashes
        // $sql = stripslashes($this->request->get('sql'));
        // $sql = $this->filterSqlQuery($sql);

        // $args = $this->request->all('args') ?: [];

        // $results = Db::getResults($sql, $args);

        // if ($wpdb->last_error) {
        //     $this->respondWithError($wpdb->last_error, 422);
        // } else {
        //     $this->respond([
        //         'results' => $results,
        //     ]);
        // }
    }

    // private function filterSqlQuery($sql)
    // {
    //     // Convert the query to uppercase for case-insensitive matching
    //     $uppercaseSQL = strtoupper($sql);

    //     // List of disallowed keywords
    //     $disallowedKeywords = [
    //         'INSERT',
    //         'UPDATE',
    //         'DELETE',
    //         'TRUNCATE',
    //         'REPLACE',
    //         'DROP',
    //         'ALTER',
    //         'CREATE',
    //         'GRANT',
    //         'REVOKE',
    //         'LOCK',
    //         'UNLOCK',
    //         'LOAD DATA',
    //         'MERGE',
    //         'SET',
    //         'CALL',
    //         'EXECUTE',
    //         'DO',
    //         'HANDLER',
    //         'RENAME',
    //         'ANALYZE',
    //         'OPTIMIZE',
    //         'REPAIR',
    //         'BACKUP',
    //         'RESTORE',
    //         'PURGE',
    //         'RESET',
    //         'START',
    //         'STOP',
    //         'COMMIT',
    //         'ROLLBACK',
    //         'SAVEPOINT',
    //     ];

    //     // Check for disallowed keywords
    //     foreach ($disallowedKeywords as $keyword) {
    //         if (strpos($uppercaseSQL, $keyword) !== false) {
    //             $disallowedKeywords[] = $keyword;
    //         }
    //     }

    //     if (! empty($disallowedKeywords)) {
    //         // Translators: %1$s is a list of disallowed SQL keywords found in the query.
    //         throw new \Exception(esc_html(printf(__('Query contains disallowed keyword: %1$s', 'agentwp'), implode(', ', $disallowedKeywords))));
    //     }

    //     // Additional checks
    //     if (preg_match('/;\s*\w/', $sql)) {
    //         throw new \Exception(esc_html__('Multiple statements are not allowed', 'agentwp'));
    //     }

    //     if (! preg_match('/^\s*SELECT\b/i', $sql)) {
    //         throw new \Exception(esc_html__('Query must start with SELECT', 'agentwp'));
    //     }

    //     // If all checks pass, return the original query
    //     return $sql;
    // }
}
