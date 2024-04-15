import { cn } from '@/lib/utils';

const conversation = [
  {
    role: 'agent',
    message: 'Hello! How can I help you today?',
  },
  {
    role: 'user',
    message: 'I need help with my order.',
  },
  {
    role: 'agent',
    message: 'Sure! Can you provide me with your order number?',
  },
  {
    role: 'user',
    message: 'Yes, it is 123456.',
  },
];

export default function Dialog() {
  return (
    <div className="bg-gray-100 p-4">
      {conversation.map((item, index) => (
        <div key={index} className="flex flex-col">
          <div
            className={cn('p-2 my-2 rounded-lg w-3/4', {
              'bg-blue-100 self-end': item.role === 'agent',
              'bg-green-100': item.role === 'user',
            })}
          >
            {item.message}
          </div>
        </div>
      ))}
    </div>
  );
}
