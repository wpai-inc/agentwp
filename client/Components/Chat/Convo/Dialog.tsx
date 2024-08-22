import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { usePage } from '@/Providers/PageProvider';
import ContentContext from '@/Components/Chat/ContentContext/ContentContext';
import { useInputSelect } from '@/Providers/InputSelectProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dialog( { conversation }: { conversation: UserRequestType[] } ) {
  const { errors } = useError();
  const { page } = usePage();
  const { selectedInput } = useInputSelect();

  return (
    <InnerContainer>
      <AnimatePresence>
        { ! conversation.length ? (
          <ChatWelcome user={ page.user } />
        ) : (
          conversation.map( msg => (
            <motion.div
              key={ msg.id }
              initial={ { opacity: 0, scale: 0 } }
              animate={ { opacity: 1, scale: 1 } }
              transition={ {
                type: 'spring',
                duration: 0.3,
                bounce: 0.25,
              } }
              exit={ { opacity: 0, scale: 0 } }>
              <Message key={ msg.id } { ...msg } />
            </motion.div>
          ) )
        ) }
      </AnimatePresence>
      { !! errors.length && <ChatError errors={ errors } /> }
      { selectedInput && <ContentContext selectedInput={ selectedInput } /> }
    </InnerContainer>
  );
}

function InnerContainer( { children }: { children: React.ReactNode } ) {
  return (
    <div className="relative mx-auto flex w-full max-w-screen-md flex-1 flex-col-reverse overflow-y-auto p-4">
      { children }
    </div>
  );
}
