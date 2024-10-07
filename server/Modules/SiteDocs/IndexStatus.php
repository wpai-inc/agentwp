<?php

namespace WpAi\AgentWp\Modules\SiteDocs;

use WpAi\AgentWp\Main;

class IndexStatus
{
    public int $id = 0;

    public string $docType;

    public int $total;

    public int $indexed;

    public float $percent;

    public bool $done;

    public int $status;

    public int $last_doc_id_indexed = 0;

    private array $comparisonKeys = ['id', 'docType', 'total', 'indexed'];

    private array $states = [
        'initiated' => 0,
        'running' => 1,
        'paused' => 2,
        'completed' => 3,
        'failed' => 4,
    ];

    public function __construct(
        int $id,
        string $docType,
        int $total,
        int $indexed,
        float $percent,
        bool $done,
        int $status = 0,
        ?int $last_doc_id_indexed = null
    ) {
        $this->id = $id;
        $this->docType = $docType;
        $this->total = $total;
        $this->indexed = $indexed;
        $this->percent = $percent;
        $this->done = $done;
        $this->status = $status;
        if ($this->last_doc_id_indexed) {
            $this->last_doc_id_indexed = $last_doc_id_indexed;
        }
    }

    public static function init(string $docType, int $total): bool
    {
        return self::set([
            'id' => 0,
            'docType' => $docType,
            'total' => $total,
            'indexed' => 0,
            'percent' => 0,
            'done' => false,
            'status' => 0,
        ]);
    }

    public static function getStatusKey(): string
    {
        return Main::prefix('docs_indexing_status');
    }

    public function pause(): bool
    {
        return $this->update('status', $this->states['paused']);
    }

    public function complete(): bool
    {
        return $this->update('status', $this->states['completed']);
    }

    public function run(): bool
    {
        return $this->update('status', $this->states['running']);
    }

    public function fail(): bool
    {
        return $this->update('status', $this->states['failed']);
    }

    public static function fromArray(array $data): self
    {
        $status = new self(
            $data['id'],
            $data['docType'],
            $data['total'],
            $data['indexed'],
            $data['percent'],
            $data['done'],
            $data['status'],
            isset($data['last_doc_id_indexed']) ? $data['last_doc_id_indexed'] : null,
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
            'status' => $this->status,
            'last_doc_id_indexed' => $this->last_doc_id_indexed,
        ];
    }

    public static function get(): ?self
    {
        if ($arr = \get_option(self::getStatusKey())) {
            return IndexStatus::fromArray($arr);
        }

        return null;
    }

    public function update(?string $key = null, $value = null): bool
    {
        $arr = $this->toArray();
        if ($key) {
            $arr[$key] = $value;
        }

        return self::set($arr);
    }

    public static function set(array $arr)
    {
        return \update_option(self::getStatusKey(), $arr);
    }
}
