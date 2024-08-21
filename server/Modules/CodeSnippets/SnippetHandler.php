<?php
/**
 * Handler for managing code snippets.
 * 
 * @package AgentWP
 */

namespace WpAi\AgentWp\Modules\CodeSnippets;

use WpAi\AgentWp\Modules\CodeSnippets\Plugins\WPCode;
use WpAi\AgentWp\Modules\CodeSnippets\Plugins\WPCodeBox;
use WpAi\AgentWp\Modules\CodeSnippets\Plugins\CodeSnippets;
use WpAi\AgentWp\Modules\CodeSnippets\Plugins\WoodySnippets;

/**
 * Snippet handler.
 */
class SnippetHandler
{
    /**
     * Active snippet class.
     * 
     * @var object|null
     */
    public $activeSnippetPlugin = null;

    /**
     * Setup the class.
     * 
     * @return void
     */
    public function __construct()
    {
        $this->activeSnippetPlugin = $this->getActiveSnippetPlugin();
    }

    /**
     * Add a new snippet.
     * 
     * @param array $data The snippet data.
     * @return string The snippet URL.
     */
    public function addSnippet(array $data): string
    {
        $title = $data['title'] ?? __('Snippet added by AgentWP', 'agentwp');
        $description = $data['description'] ?? '';
        $lang = $data['lang'] ?? 'php';
        $scope = $data['scope'] ?? 'global';
        $priority = $data['priority'] ?? 10;

        return $this->activeSnippetPlugin->add(
            $data['code'],
            $title,
            $description,
            $lang,
            $scope,
            $priority
        );
    }

    /**
     * Get the active snippet class.
     * 
     * @return object|null
     */
    private function getActiveSnippetPlugin(): ?object
    {
        switch (true) {
            case WPCode::isActive():
                return new WPCode();
            
            case WPCodeBox::isActive():
                return new WPCodeBox();
            
            case CodeSnippets::isActive():
                return new CodeSnippets();

            case WoodySnippets::isActive():
                return new WoodySnippets();
            
            default:
                return null;
        }
    }
}