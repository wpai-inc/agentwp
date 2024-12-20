import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import OpenNewIcon from '@material-design-icons/svg/outlined/open_in_new.svg?react';
import { WpUser } from '@/Types/types';
import { useChat } from '@/Providers/ChatProvider';
import { motion } from 'framer-motion';
import { useRestRequest } from '@/Providers/RestRequestProvider';

type SuggestionType = {
  suggestion: string;
  prompt: string;
};

export default function ChatWelcome( { user }: { user: WpUser } ) {
  const name = user.display_name;
  const { sendMessage } = useChat();
  const { proxyApiRequest } = useRestRequest();
  const [ suggestions, setSuggestions ] = useState< SuggestionType[] >( [
    {
      suggestion: 'What WordPress version am I running?',
      prompt: 'What WordPress version am I running?',
    },
    {
      suggestion: 'Help me create a new blog post.',
      prompt: 'Help me create a new blog post.',
    },
    {
      suggestion: 'Make a snippet to add a new CPT',
      prompt: 'Make a snippet to add a new CPT',
    },
    {
      suggestion: 'Who are you?',
      prompt: 'Who are you?',
    },
  ] );

  useEffect( () => {
    proxyApiRequest< SuggestionType[] >( 'siteSuggestions' ).then( response =>
      setSuggestions( response ),
    );
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
      className="flex flex-col h-full justify-center items-center p-4">
      <p className="text-3xl font-semibold text-black mb-2">Hi { name },</p>
      <p className="text-xl text-center text-black">Here are some things I can help you with.</p>
      <div className={ cn( 'grid grid-cols-2 gap-3 mt-4 w-full max-w-96' ) }>
        { suggestions &&
          suggestions.map( ( item: SuggestionType, key: number ) => (
            <ChatOption
              key={ key }
              index={ key }
              message={ item.suggestion }
              onClick={ item ? () => sendMessage( item.prompt ) : undefined }
            />
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

function ChatOption( {
  message,
  onClick,
  index,
}: {
  message: string | null;
  onClick?: () => void;
  index: number;
} ) {
  const delay: {
    [ index: number ]: string;
  } = {
    0: 'delay-0',
    1: 'delay-75',
    2: 'delay-100',
    3: 'delay-150',
  };

  return (
    <div
      onClick={ onClick && onClick }
      className={ cn(
        'flex items-center justify-center shadow-sm p-4 bg-brand-gray cursor-pointer h-full rounded-lg text-base leading-normal text-center text-gray-600 transition min-h-12 w-full',
        {
          'hover:bg-brand-gray-20 duration-200': message,
          'animate-pulse duration-1000': ! message,
          [ delay[ index ] ]: ! message,
        },
      ) }>
      { message && <p className="line-clamp-3">{ message }</p> }
    </div>
  );
}
