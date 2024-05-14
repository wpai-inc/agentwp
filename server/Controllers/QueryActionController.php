<?php

namespace WpAi\AgentWp\Controllers;

class QueryActionController extends BaseController
{
    public function query(): void
    {
        global $wpdb;
        // unescape slashes
        $sql = stripslashes($this->request->query->get('sql'));
        $params = $this->request->query->get('params');

        $prepared_query = $wpdb->prepare($sql, $params);

        $results = $wpdb->get_results($prepared_query);

        $this->respond([
            'results' => $results,
        ]);
    }
}
