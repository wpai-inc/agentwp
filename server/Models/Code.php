<?php

namespace WpAi\AgentWp\Models;

if (! defined('ABSPATH')) {
    exit;
}

class Code extends BaseModel
{
    protected static $table = 'code';

    protected array $casts = [
        'id' => 'int',
        'active' => 'bool',
        'stale' => 'bool',
        'error' => 'bool',
    ];

    private array $modes = ['always', 'once', 'repeated'];

    public function scopeActive()
    {
        $this->where('active', '=', 1);

        return $this;
    }

    public function scopeMode($mode)
    {
        if (! in_array($mode, $this->modes)) {
            throw new \Exception('Invalid mode');
        }

        $this->where('mode', '=', $mode);

        return $this;
    }
}
