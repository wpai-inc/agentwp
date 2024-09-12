<?php

return [
    'api.auth.generate-token' => [
        'method' => 'POST',
        'url' => '/auth/generate-token',
    ],
    'api.auth.renew-token' => [
        'method' => 'POST',
        'url' => '/auth/renew-token',
    ],
    'api.auth.revoke-token' => [
        'method' => 'DELETE',
        'url' => '/auth/revoke-token',
    ],
    'api.auth.revoke-tokens' => [
        'method' => 'DELETE',
        'url' => '/auth/revoke-tokens',
    ],
    'api.capabilities' => [
        'method' => 'GET',
        'url' => '/capabilities',
    ],
    'api.site.user' => [
        'method' => 'GET',
        'url' => '/sites/{site}/user',
    ],
    'api.site.wpuser.update' => [
        'method' => 'PUT',
        'url' => '/sites/{site}/wpuser',
    ],
    'api.site.convo.create' => [
        'method' => 'POST',
        'url' => '/sites/{site}',
    ],
    'api.site.convo.clear' => [
        'method' => 'POST',
        'url' => '/sites/{site}/clear',
    ],
    'api.site.disconnect' => [
        'method' => 'GET',
        'url' => '/sites/{site}/disconnect',
    ],
    'api.site.docs.store' => [
        'method' => 'POST',
        'url' => '/sites/{site}/docs',
    ],
    'api.site.docs.index.status' => [
        'method' => 'GET',
        'url' => '/sites/{site}/docs/status',
    ],
    'api.site.docs.status' => [
        'method' => 'GET',
        'url' => '/sites/{site}/docs/status/{status}',
    ],
    'api.site.errors.store' => [
        'method' => 'POST',
        'url' => '/sites/{site}/errors',
    ],
    'api.site.request.escalate' => [
        'method' => 'POST',
        'url' => '/sites/{site}/escalation/{escalation}',
    ],
    'api.site.health' => [
        'method' => 'POST',
        'url' => '/sites/{site}/health',
    ],
    'api.site.convo.history' => [
        'method' => 'GET',
        'url' => '/sites/{site}/history',
    ],
    'api.site.request.abort' => [
        'method' => 'POST',
        'url' => '/sites/{site}/request/{userRequest}/abort',
    ],
    'api.site.request.action.error' => [
        'method' => 'POST',
        'url' => '/sites/{site}/request/{userRequest}/action/{agentAction}/error',
    ],
    'api.site.request.action.result' => [
        'method' => 'POST',
        'url' => '/sites/{site}/request/{userRequest}/action/{agentAction}/result',
    ],
    'api.site.request.feedback' => [
        'method' => 'POST',
        'url' => '/sites/{site}/request/{userRequest}/feedback',
    ],
    'api.site.request.remove' => [
        'method' => 'DELETE',
        'url' => '/sites/{site}/request/{userRequest}/request/{ur}',
    ],
    'api.site.request.stream' => [
        'method' => 'POST',
        'url' => '/sites/{site}/request/{userRequest}/stream',
    ],
    'api.site.search' => [
        'method' => 'POST',
        'url' => '/sites/{site}/search',
    ],
    'api.site.search.summarize' => [
        'method' => 'POST',
        'url' => '/sites/{site}/search/{query}/summary',
    ],
    'api.site.setting.save' => [
        'method' => 'PUT',
        'url' => '/sites/{site}/settings',
    ],
    'api.site.setting.all' => [
        'method' => 'GET',
        'url' => '/sites/{site}/settings',
    ],
    'api.site.suggestions' => [
        'method' => 'POST',
        'url' => '/sites/{site}/suggestions',
    ],
    'api.site.summarize' => [
        'method' => 'POST',
        'url' => '/sites/{site}/summarize',
    ],
    'api.site.convo.unclear' => [
        'method' => 'POST',
        'url' => '/sites/{site}/unclear',
    ],
    'api.site.convo.delete' => [
        'method' => 'DELETE',
        'url' => '/sites/{site}/{convo}',
    ],
];
