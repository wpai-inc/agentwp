<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Traits\GeneralSettingsData;

class UpdateGeneralSettings extends BaseController
{

    use GeneralSettingsData;

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
