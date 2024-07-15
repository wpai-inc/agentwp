<?php

namespace WpAi\AgentWp\Modules\Summarization\Sources;

interface SourceInterface
{
    public function name(): string;

    public function isActive(): bool;

    public function getData(): array;
}
