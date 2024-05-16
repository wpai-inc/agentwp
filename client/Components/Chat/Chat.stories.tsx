import type { Meta, StoryObj } from '@storybook/react';

import Chat from './Chat';
import { UserRequestType } from '@/Providers/UserRequestsProvider';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Chat> = {
  component: Chat,
};

export default meta;
type Story = StoryObj<typeof Chat>;

const sampleRichMessages: UserRequestType[] = [
  {
    id: '4000',
    message: 'Show me user growth for the current year',
    agent_actions: [
      {
        id: '4001',
        final: true,
        recipe_idx: 0,
        result: {},
        hasExecuted: true,
        action: {
          ability: 'message',
          text: "Here's a chart with user growth for the current year",
          graph: {
            graphType: 'line',
            data: [
              { label: 'Jan', value: 300 },
              { label: 'Feb', value: 500 },
              { label: 'Mar', value: 600 },
              { label: 'Apr', value: 900 },
            ],
          },
        },
      },
    ],
  },
  {
    id: '4002',
    message: 'Show me user growth for the current year in a bar chart',
    agent_actions: [
      {
        id: '4003',
        final: true,
        recipe_idx: 0,
        result: {},
        hasExecuted: true,
        action: {
          ability: 'message',
          text: "Here's a chart with user growth for the current year",
          graph: {
            graphType: 'bar',
            data: [
              { label: 'Jan', value: 300 },
              { label: 'Feb', value: 500 },
              { label: 'Mar', value: 600 },
              { label: 'Apr', value: 900 },
            ],
          },
        },
      },
    ],
  },
  {
    id: '4004',
    message: 'Show me how many of my users are paid vs free',
    agent_actions: [
      {
        id: '4005',
        final: true,
        recipe_idx: 0,
        result: {},
        hasExecuted: true,
        action: {
          ability: 'message',
          text: "Here's a chart comparing free vs paid users",
          graph: {
            graphType: 'pie',
            data: [
              { label: 'Free', value: 300 },
              { label: 'Paid', value: 500 },
            ],
          },
        },
      },
    ],
  },
];

export const ChatStory: Story = {
  args: {
    messages: sampleRichMessages,
    chatOpen: true,
  },
};
