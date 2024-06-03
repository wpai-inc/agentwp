import { cn } from '@/lib/utils';
import ChatOption from '@/Components/Chat/Convo/Actions/ChatOption/ChatOption';
import OpenNewIcon from '@material-design-icons/svg/outlined/open_in_new.svg?react';

const ChatWelcome = () => {
  const name = 'James';
  const options = [
    {
      id: 1,
      message: 'Safely update my plugins.',
      onClick: () => {},
    },
    {
      id: 2,
      message: 'Explain what settings are available to me.',
      onClick: () => {},
    },
    {
      id: 3,
      message: 'Audit WooCommerce settings for best practices.',
      onClick: () => {},
    },
    {
      id: 4,
      message: 'Get statistics about my WooCommerce shop.',
      onClick: () => {},
    },
  ];

  return (
    <div className="flex flex-col items-center mb-8">
      <p className="text-3xl font-semibold text-black">Hi { name },</p>
      <p className="text-xl text-center text-black">
        You're currently on the WooCommerce settings page. Here's what I can help you with.
      </p>
      <div className={ cn( 'grid grid-cols-2 gap-3 mt-3' ) }>
        { options.map( option => (
          <div key={ option.id }>
            <ChatOption message={ option.message } onClick={ option.onClick } />
          </div>
        ) ) }
        <div
          className={ cn(
            'bg-brand-gray-20 cursor-pointer mt-2 rounded-lg self-stretch',
            'px-3 py-2 flex items-center justify-between text-gray-600',
            'col-span-2 shadow-sm',
          ) }>
          All Capabilities
          <OpenNewIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatWelcome;
