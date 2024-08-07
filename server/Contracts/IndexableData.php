<?php

namespace WpAi\AgentWp\Contracts;

interface IndexableData
{
    public function send();

    public function eventName(): string;
}
