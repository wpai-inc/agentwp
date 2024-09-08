<?php

namespace WpAi\AgentWp\Modules\SiteDocs;

use WpAi\AgentWp\Main;

class IndexStatus
{
    public int $id;
    public string $docType;
    public int $total;
    public int $indexed;
    public float $percent;
    public bool $done;

    public static string $statusKey = 'docs_indexing_status';

    private array $comparisonKeys = ['id', 'docType', 'total', 'indexed'];

    public function __construct(
        int $id,
        string $docType,
        int $total,
        int $indexed,
        float $percent,
        bool $done
    ) {
        $this->id = $id;
        $this->docType = $docType;
        $this->total = $total;
        $this->indexed = $indexed;
        $this->percent = $percent;
        $this->done = $done;
    }

    public static function getStatusKey(): string
    {
        return Main::SLUG . '_' . self::$statusKey;
    }

    public static function fromArray(array $data): self
    {
        $status = new self(
            $data['id'],
            $data['docType'],
            $data['total'],
            $data['indexed'],
            $data['percent'],
            $data['done']
        );
        return $status;
    }

    public function same(?IndexStatus $status = null): bool
    {
        if (is_null($status)) {
            return false;
        }

        foreach ($this->comparisonKeys as $key) {
            if ($this->$key !== $status->$key) {
                return false;
            }
        }

        return true;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'docType' => $this->docType,
            'total' => $this->total,
            'indexed' => $this->indexed,
            'percent' => $this->percent,
            'done' => $this->done,
        ];
    }

    public static function get(): ?self
    {
        if ($arr = \get_option(self::getStatusKey())) {
            return IndexStatus::fromArray($arr);
        }

        return null;
    }

    public function update(): bool
    {
        return \update_option($this->getStatusKey(), $this->toArray());
    }
}
