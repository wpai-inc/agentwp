<?php

namespace WpAi\AgentWp\Page\Admin;

use WpAi\AgentWp\Contracts\Registrable;
use WpAi\AgentWp\Main;
use WpAi\AgentWp\Traits\HasPage;

class Settings implements Registrable
{
    use HasPage;

    public function __construct(private Main $main)
    {
    }

    public function register()
    {
        $this
            ->pageName('Admin/Settings')
            ->menuName('Agent WP Settings')
            ->registerPage();
    }

    public function onMenuLoad()
    {
        // $screen = get_current_screen();
        // $screen->add_help_tab(
        //     [
        //         'id' => 'codewpai_400_error_help_tab',
        //         'title' => __('400 Error?', 'ai-for-wp'),
        //         // translators: %s: will be replaced by current site URL
        //         'content' => '<p>'
        //                      .sprintf(
        //                          __(
        //                              'Ensure that the site url, <strong>%s</strong>, is equal to the Project URL in CodeWP.',
        //                              'ai-for-wp'
        //                          ),
        //                          get_site_url()
        //                      )
        //                      .'</p>',
        //     ]
        // );
        // $screen->add_help_tab(
        //     [
        //         'id' => 'codewpai_pro_user_help_tab',
        //         'title' => __('CodeWP Pro User?', 'ai-for-wp'),
        //         'content' => '<p>'
        //                      .__(
        //                          'Contact us and we\'ll walk you through the setup of this plugin.',
        //                          'ai-for-wp'
        //                      )
        //                      .'</p>',
        //     ]
        // );
    }
}
