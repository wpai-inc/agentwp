<?php

namespace WpAi\AgentWp\Controllers;

class QueryActionController extends BaseController
{
    public function __invoke(): void
    {
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

        $results = $wpdb->get_results($prepared_query);

        if ($wpdb->last_error) {
            $this->respondWithError($wpdb->last_error, 422);
        } else {
            $this->respond([
                'results' => $results,
            ]);
        }
    }
}
