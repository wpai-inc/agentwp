<?php

namespace WpAi\AgentWp\Modules\SiteDocs\Interfaces;

use WpAi\AgentWp\Modules\SiteDocs\IndexStatus;

interface DocInterface
{
    public function __construct(int $batchAmount);

    public function setStatus(IndexStatus $status): self;

    public function getTotal(): int;

    public function getBatchAmount(): int;

    public function getDocType(): string;

    public function getDocs(): array;

    public function getSchemas(): array;

    public function toArray(): array;
}
