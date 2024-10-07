<?php

namespace WpAi\AgentWp\Modules\SiteDocs;

class SiteDocs
{
    private ?IndexStatus $status = null;

    protected $docTypes = [
        'post' => DocPost::class,
    ];

    public function setStatus(?IndexStatus $status = null): self
    {
        if ($status) {
            $this->status = $status;
        }

        return $this;
    }

    public function init(): self
    {
        $docType = $this->getDocType();
        $doc = $this->getDoc($docType);
        IndexStatus::init($docType, $doc->getTotal());

        return $this;
    }

    public function inprogress(): bool
    {
        if ($this->status) {
            return $this->status->status === 1;
        }

        return true;
    }

    public function getDoc(string $docType): Doc
    {
        if (! isset($this->docTypes[$docType])) {
            // Translators: %1$s is the doc type that was not found.
            throw new \Exception(esc_html(sprintf(__('Doc type not found: %1$s', 'agentwp'), $docType)));
        }
        $docClass = $this->docTypes[$docType];

        return new $docClass;
    }

    public function data(): array
    {
        $docType = $this->getDocType();
        $doc = $this->getDoc($docType);
        if ($this->status) {
            $doc->setStatus($this->status);
        }

        return $doc->toArray();
    }

    /**
     * Gets the doctype key from status
     * and if not found, returns the first key
     * of $this->docTypes
     */
    private function getDocType(): string
    {
        $keys = array_keys($this->docTypes);
        if ($this->status && in_array($this->status->docType, $keys)) {
            return $this->status->docType;
        }

        return $keys[0];
    }
}
