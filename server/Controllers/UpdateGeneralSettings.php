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
        $data = json_decode(file_get_contents('php://input'));
        $general_settings = $this->sanitize_settings($data);
        $this->main->settings->set('general_settings', $general_settings);
        wp_send_json($general_settings);
    }
}
