import { cn } from '@/lib/utils';
import ChatOption from '@/Components/Chat/Convo/Actions/ChatOption/ChatOption';
import OpenNewIcon from '@material-design-icons/svg/outlined/open_in_new.svg?react';
import { WpUser } from '@/Types/types';
import { useChat } from '@/Providers/ChatProvider';

type Option = {
  id: number;
  message: string;
  onClick?: () => void;
};

export default function ChatWelcome( { user }: { user: WpUser } ) {
  const name = user.display_name;
  const { sendMessage } = useChat();
  const options: Option[] = [
    {
      id: 1,
      message: 'Safely update my plugins.',
    },
    {
      id: 2,
      message: 'Explain what settings are available to me.',
    },
    {
      id: 3,
      message: 'Audit WooCommerce settings for best practices.',
    },
    {
      id: 4,
      message: 'Get statistics about my WooCommerce shop.',
    },
  ];

  function doOnClick( option: Option ) {
    console.log( option );
    if ( option.onClick ) {
      option.onClick();
    } else {
      sendMessage( option.message );
    }
  }

  return (
    <div className="flex flex-col h-full justify-center items-center mb-8">
      <p className="text-3xl font-semibold text-black">Hi { name },</p>
      <p className="text-xl text-center text-black">Here are some things I can help you with.</p>
      <div className={ cn( 'grid grid-cols-2 gap-3 mt-3' ) }>
        { options.map( option => (
          <div key={ option.id }>
            <ChatOption message={ option.message } onClick={ () => doOnClick( option ) } />
          </div>
        ) ) }
        <a
          href="https://agentwp.com/capabilities/"
          target="_blank"
          className={ cn(
            'block bg-brand-gray-20 cursor-pointer mt-2 rounded-lg self-stretch',
            'px-3 py-2 flex items-center justify-between text-gray-600',
            'col-span-2 shadow-sm',
          ) }>
          All Capabilities
          <OpenNewIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
