<?php

namespace WpAi\AgentWp\Controllers;

class QueryActionController extends BaseController
{
    public function query(): void
    {
        global $wpdb;
        // unescape slashes
        $sql = stripslashes($this->request->query->get('sql'));
        $args = $this->request->query->get('args');

        $prepared_query = $wpdb->prepare($sql, $args);

        $results = $wpdb->get_results($prepared_query);

        $this->respond([
            'results' => $results,
        ]);
    }
}
