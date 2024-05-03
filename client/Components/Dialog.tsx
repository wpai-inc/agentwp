import { useChat } from '@/Providers/ChatProvider';
import Message from '@/Components/Convo/Message';

export default function Dialog() {
  const { conversation } = useChat();
  const extraRichMessages: any[] = [
    ...conversation,
    {
      id: 4000,
      role: 'user',
      content: 'Show me user growth for the current year'
    },
    {
      id: 4001,
      role: 'agent',
      content: {
        ability: 'message',
        text: "Here's a chart with user growth for the current year",
        graph: {
          graphType: 'line',
          data: [
            { label: 'Jan', value: 300 },
            { label: 'Feb', value: 500 },
            { label: 'Mar', value: 600 },
            { label: 'Apr', value: 900 },
          ]
        }
      },
    },
    {
      id: 4002,
      role: 'user',
      content: 'Show me user growth for the current year in a bar chart'
    },
    {
      id: 4003,
      role: 'agent',
      content: {
        ability: 'message',
        text: "Here's a chart with user growth for the current year",
        graph: {
          graphType: 'bar',
          data: [
            { label: 'Jan', value: 300 },
            { label: 'Feb', value: 500 },
            { label: 'Mar', value: 600 },
            { label: 'Apr', value: 900 },
          ]
        }
      },
    },
    {
      id: 4004,
      role: 'user',
      content: 'Show me how many of my users are paid vs free'
    },
    {
      id: 4005,
      role: 'agent',
      content: {
        ability: 'message',
        text: "Here's a chart comparing free vs paid users",
        graph: {
          graphType: 'pie',
          data: [
            { label: 'Free', value: 300 },
            { label: 'Paid', value: 500 },
          ]
        }
      },
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 flex flex-col space-y-6 divide-y-2">
        {extraRichMessages.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}
      </div>
    </div>
  );
}
