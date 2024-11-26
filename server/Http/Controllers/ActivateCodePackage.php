<?php

namespace WpAi\AgentWp\Http\Controllers;

use WpAi\AgentWp\Models\Code;

class ActivateCodePackage extends BaseController
{
    protected string $method = 'post';

    public function __invoke()
    {
        $pkg = $this->main->client()->codePackagesShow(['pkg' => $this->request->code_id])->get();

        if ($code = Code::find($this->request->id)) {
            $state = $code->update(['active' => $this->request->active]);
        } else {
            if ($files = $pkg['files']) {
                $dir = wp_upload_dir()['basedir'].'/code/'.$pkg['id'];

                // download files to directory
                foreach ($files as $file) {
                    if (! file_exists($dir)) {
                        mkdir($dir, 0777, true);
                    }

                    $contents = file_get_contents($file['download_url']);
                    file_put_contents($dir.'/'.$file['name'], $contents);
                }

                $state = Code::create([
                    'code_id' => $pkg['id'],
                    'path' => $dir,
                ]);
            }
        }

        if ($state) {
            $pkg['state'] = $state;
        }

        return $this->respond($pkg);
    }
}
