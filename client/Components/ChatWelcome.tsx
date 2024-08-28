import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ChatOption from '@/Components/Chat/Convo/Actions/ChatOption/ChatOption';
import OpenNewIcon from '@material-design-icons/svg/outlined/open_in_new.svg?react';
import { WpUser } from '@/Types/types';
import { useChat } from '@/Providers/ChatProvider';
import { motion } from 'framer-motion';
import { useClient } from '@/Providers/ClientProvider';

export default function ChatWelcome( { user }: { user: WpUser } ) {
  const name = user.display_name;
  const { sendMessage } = useChat();
  const { getSuggestions } = useClient();
  const [ suggestions, setSuggestions ] = useState< string[] >( [] );

  useEffect( () => {
    getSuggestions().then( ( response: string[] ) => {
      setSuggestions( response );
    } );
  }, [] );

  return (
    <motion.div
      key="chat-welcome"
      initial={ { opacity: 0, scale: 0 } }
      animate={ { opacity: 1, scale: 1 } }
      transition={ {
        type: 'spring',
        duration: 0.3,
        bounce: 0.25,
      } }
      exit={ { opacity: 0, scale: 0 } }
      className="flex flex-col h-full justify-center items-center mb-8">
      <p className="text-3xl font-semibold text-black">Hi { name },</p>
      <p className="text-xl text-center text-black">Here are some things I can help you with.</p>
      <div className={ cn( 'grid grid-cols-2 gap-3 mt-3' ) }>
        { suggestions.map( ( msg, key ) => (
          <div key={ key }>
            <ChatOption message={ msg } onClick={ () => sendMessage( msg ) } />
          </div>
        ) ) }
        <a
          href="https://agentwp.com/capabilities/"
          target="_blank"
          className={ cn(
            'block bg-brand-gray cursor-pointer mt-2 rounded-lg self-stretch',
            'px-3 py-2 flex items-center justify-between text-gray-600',
            'col-span-2 shadow-sm',
          ) }>
          All Capabilities
          <OpenNewIcon className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
