<?php

namespace WpAi\AgentWp\Contracts;

interface ClientAppInterface
{
    public function appRoot(): void;

    public function data(): array;
}
