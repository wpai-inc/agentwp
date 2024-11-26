<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Models\Code;

class SearchCodePackages extends BaseController
{
    public function __invoke()
    {
        $states = Code::query()->get();
        $search = $this->main->client()->codePackagesSearch()->get();

        $package = array_map(function ($pkg) use ($states) {
            foreach ($states as $state) {
                if ($state->code_id === $pkg['id']) {
                    $pkg['state'] = $state;
                }
            }

            return $pkg;
        }, $search);

        return $this->respond($package);
    }
}
