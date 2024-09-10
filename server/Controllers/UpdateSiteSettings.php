<?php

namespace WpAi\AgentWp\Controllers;

use WpAi\AgentWp\Services\Transient;

class UpdateSiteSettings extends BaseController
{
    use \WpAi\AgentWp\Traits\SiteSettings;

    protected string $permission = 'canGenerateVerificationKey';

    protected string $method = 'POST';

    public function update_site_settings(): void
    {
        $this->verifyNonce();
        $data = $this->getContent();

        $transient = new Transient($this->main);

        $transient->set('account_settings', $this->parseSettings($data), 12 * HOUR_IN_SECONDS);

        $this->respond($data);
    }
}
