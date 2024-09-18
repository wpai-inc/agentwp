<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Registry\IndexSiteSummary;

class Tools extends BaseController
{
    protected string $method = 'POST';

    public function summarize(): void
    {
        $summarizer = (new IndexSiteSummary($this->main));
        $summarizer->scheduleNow('autoUpdate');
    }
}
