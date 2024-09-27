<?php

namespace WpAi\AgentWp\Traits;

trait HasMentions
{
    /**
     * Handle mentions.
     * 
     * @param array $request_array
     * @return array
     */
    public function handleMentions(array $request_array): array
    {
        if (!isset($request_array['mentions']) || !is_array($request_array['mentions'])) {
            return $request_array;
        }

        foreach ($request_array['mentions'] as $key => $mention) {
            if (!isset($mention['type']) && !isset($mention['id'])) {
                unset($request_array['mentions'][$key]);
                continue;
            }

            $mentionData = $this->getMentionData($mention['type'], $mention['id']);
            if (empty($mentionData)) {
                unset($request_array['mentions'][$key]);
                continue;
            }

            $request_array['mentions'][$key] = $mentionData;
        }

        return $request_array;
    }

    /**
     * Get mention data.
     * 
     * @param string $type
     * @param int $id
     * @return array
     */
    private function getMentionData(string $type, int $id): array
    {
        switch ($type) {
            case 'user':
                return $this->getUserData($id);
            case 'post':
            case 'page':
                return $this->getPostData($id);
            default:
                return [];
        }
    }

    /**
     * Get user data.
     * 
     * @param int $id
     * @return array
     */
    private function getUserData(int $id): array
    {
        $user = get_user_by('id', $id);
        if (empty($user)) {
            return [];
        }

        $userArray = $user->to_array();
        unset($userArray['user_pass']);

        return [
            'object' => 'user',
            'data' => $userArray,
            'meta' => get_user_meta($user->ID),
        ];
    }

    /**
     * Get post data.
     * 
     * @param int $id
     * @return array
     */
    private function getPostData(int $id): array
    {
        $post = get_post($id, ARRAY_A);
        if (empty($post)) {
            return [];
        }

        return [
            'object' => $post['post_type'],
            'data' => $post,
            'meta' => get_post_meta($post['ID']),
        ];
    }
}