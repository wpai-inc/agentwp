<?php

namespace WpAi\AgentWp\Actions;

abstract class Action
{
    public function __construct($nonce)
    {
        \check_ajax_referer($nonce.'-ajax-nonce', 'nonce');
    }

    protected function respond(array $arr)
    {
        \wp_send_json_success($arr);
    }
}
