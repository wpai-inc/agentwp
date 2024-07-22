<?php

namespace WpAi\AgentWp\Modules\Summarization\Sources;

use WP_Post;

class Core implements SourceInterface
{
    public function name(): string
    {
        return 'wordpress_core';
    }

    public function isActive(): bool
    {
        return true;
    }

    public function getData(): array
    {
        return array_merge(
            $this->getSiteData(),
            $this->getHomePageData(),
            $this->getParentPageTitles(),
            $this->getExcerpts(),
            $this->getAdminUserBios(),
            $this->getThemeJson(),
        );
    }

    private function getHomePageData(): array
    {
        $home_page_id = \get_option('page_on_front');
        $hp = \get_post($home_page_id);
        if ($hp instanceof \WP_Post) {

            $content = $this->sanitize(\apply_filters('the_content', $hp->post_content));

            return [
                'home' => [
                    'title' => \apply_filters('the_title', $hp->post_title),
                    'content' => $content,
                    'meta' => \get_post_meta($home_page_id),
                ],
            ];
        }

        return [];
    }

    private function getAdminUserBios(): array
    {
        $admin_users = get_users(['role' => 'administrator']);
        $admin_info = array_map(function ($user) {
            return [
                'name' => htmlspecialchars($user->display_name, ENT_QUOTES, 'UTF-8'),
                'bio' => htmlspecialchars(
                    get_user_meta($user->ID, 'description', true),
                    ENT_QUOTES,
                    'UTF-8'
                ),
            ];
        }, $admin_users);

        return [
            'admin_user_bios' => $admin_info,
        ];
    }

    private function sanitize($content): string
    {
        return $this->escape(
            \wp_strip_all_tags(
                $content
            )
        );
    }

    /**
     * Escape HTML characters to prevent rendering
     */
    private function escape(string $content): string
    {
        return htmlspecialchars(
            $content,
            ENT_QUOTES,
            'UTF-8'
        );
    }

    /**
     * Get the 20 most recent parent page titles
     */
    private function getParentPageTitles(): array
    {
        $parent_page_titles = [];
        $parent_pages = \get_pages([
            'parent' => 0,
            'sort_column' => 'menu_order',
            'sort_order' => 'asc',
            'number' => 20,
        ]);

        foreach ($parent_pages as $parent_page) {
            $parent_page_titles[] = \apply_filters('the_title', $parent_page->post_title);
        }

        return [
            'parent_page_titles' => $parent_page_titles,
        ];
    }

    private function getSiteData(): array
    {
        return [
            'site' => [
                'url' => \get_bloginfo('url'),
                'title' => \get_bloginfo('name'),
                'description' => \get_bloginfo('description'),
            ],
        ];
    }

    private function getExcerpts(): array
    {
        $excerpts = [];
        $recent_posts = \get_posts([
            'post_type' => 'post',
            'numberposts' => 5,
            'post_status' => 'publish',
            'sort_column' => 'post_date',
            'sort_order' => 'desc',
        ]);
        $recent_pages = \get_posts([
            'post_type' => 'page',
            'numberposts' => 5,
            'post_status' => 'publish',
            'sort_column' => 'post_date',
            'sort_order' => 'desc',
        ]);

        foreach ($recent_posts as $post) {
            $excerpts['recent_posts'][] = [
                'title' => $this->cleanPostTitle($post),
                'excerpt' => $this->cleanPostExcerpt($post),
            ];
        }

        foreach ($recent_pages as $post) {
            $excerpts['recent_pages'] = [
                'title' => $this->cleanPostTitle($post),
                'excerpt' => $this->cleanPostExcerpt($post),
            ];
        }

        return [
            'excerpts' => $excerpts,
        ];
    }

    private function cleanPostTitle(WP_Post $post): string
    {
        return htmlspecialchars(\apply_filters('the_title', $post->post_title), ENT_QUOTES, 'UTF-8');
    }

    private function cleanPostExcerpt(WP_Post $post, $length = 55): string
    {
        return htmlspecialchars(
            wp_trim_words(\apply_filters('the_content', $post->post_content), $length),
            ENT_QUOTES,
            'UTF-8'
        );
    }

    private function getThemeJson(): array
    {
        $theme = wp_get_theme();
        $theme_json = $theme->get('ThemeURI');
        $theme_json = $theme_json ? $theme_json : $theme->get('TextDomain');

        return [
            'theme' => [
                'name' => $theme->get('Name'),
                'version' => $theme->get('Version'),
                'uri' => $theme_json,
            ],
        ];
    }
}
