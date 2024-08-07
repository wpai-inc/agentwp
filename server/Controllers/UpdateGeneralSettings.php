<?php

namespace WpAi\AgentWp\Controllers;

class UpdateGeneralSettings extends BaseController
{
    protected string $permission = 'canGenerateVerificationKey';

    protected string $method = 'POST';

    public function update_settings(): void
    {
        $this->verifyNonce();
        $data             = $this->getContent();
        $general_settings = $this->main->settings->updateGeneralSettings($data);
        $this->respond($general_settings);
    }
}
