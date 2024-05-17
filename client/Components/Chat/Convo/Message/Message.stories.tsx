import type { Meta, StoryObj } from '@storybook/react';

import Message from './Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';

const meta: Meta<typeof Message> = {
  component: Message,
};

const userRequest: UserRequestType = {
  id: '1',
  wp_user_id: 1,
  created_at: '2021-10-01T00:00:00',
  human_created_at: '2 hours ago',
  message: 'Can you please change my Store Address to 123 main street?',
  user: {
    name: 'James Lepage',
    email: 'james@codewp.ai',
  },
  agent_actions: [
    {
      id: '9c0b2f24-516a-470f-9ac4-b09659f3db0c',
      created_at: '2021-10-01T00:00:00',
      human_created_at: '2 hours ago',
      action: {
        ability: 'query',
        sql: "SELECT DATE_FORMAT(post_date, '%Y-%m') AS month, COUNT(*) AS post_count FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish' GROUP BY month ORDER BY month DESC",
        args: [],
      },
      result: {
        status: 'success',
        data: [{ month: '2024-04', post_count: '1' }],
      },
      recipe_idx: 0,
      final: false,
      hasExecuted: true,
    },
    {
      id: '9c0ccac9-e4e4-4b8b-a396-fa7b81ccbbd6',
      created_at: '2021-10-01T00:00:00',
      human_created_at: '2 hours ago',
      action: {
        ability: 'message',
        graph: {
          graphType: 'bar',
          title: 'Number of Posts Per Month',
          data: [{ name: '2024-04', post_count: 1 }],
        },
        text: '### Number of Posts Per Month\n\nHere is the number of posts created per month on your WordPress website:\n\n```plaintext\nApril 2024: 1 post\n```\n\n#### Visualization\n\n**Bar Graph**: Number of Posts per Month\n\nWould you like any additional details or further analysis?',
      },
      result: { status: 'success' },
      recipe_idx: 1,
      final: true,
      hasExecuted: true,
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Message>;

export const MessageStory: Story = {
  parameters: {
    backgrounds: { default: 'chatContainer' },
  },
  args: {
    ...userRequest,
  },
};