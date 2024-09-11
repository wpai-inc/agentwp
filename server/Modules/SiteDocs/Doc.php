<?php

namespace WpAi\AgentWp\Modules\SiteDocs;

use JsonSerializable;
use WpAi\AgentWp\Modules\SiteDocs\Interfaces\DocInterface;

abstract class Doc implements DocInterface, JsonSerializable
{
    protected array $schemas;

    protected ?IndexStatus $status = null;

    protected string $docType;

    protected int $batchAmount;

    public function __construct(int $batchAmount = 10)
    {
        $this->batchAmount = $batchAmount;
    }

    public function setStatus(IndexStatus $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getTotalPages(): int
    {
        return ceil($this->getTotal() / $this->getBatchAmount());
    }

    public function getBatchAmount(): int
    {
        return $this->batchAmount;
    }

    public function getDocType(): string
    {
        return $this->docType;
    }

    public function getSchemas(): array
    {
        return $this->schemas;

        // $schemas = [];
        // foreach ($this->schemas as $name) {
        //     $path = __DIR__."/EmbedSchemas/{$name}.json";
        //     if (! file_exists($path)) {
        //         continue;
        //     }

        //     $contents = file_get_contents($path);
        //     if ($contents) {
        //         $schemas[$name] = $contents;
        //     }
        // }

        // return $schemas;
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public function toArray(): array
    {
        return [
            'status' => $this->status ? $this->status->id : null,
            'total' => $this->getTotal(),
            'total_pages' => $this->getTotalPages(),
            'batch_amount' => $this->getBatchAmount(),
            'doc_type' => $this->getDocType(),
            'docs' => $this->getDocs(),
        ];
    }

    abstract public function getTotal(): int;

    abstract public function getDocs(): array;
}
