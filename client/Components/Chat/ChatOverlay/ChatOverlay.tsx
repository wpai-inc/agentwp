import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import { Button } from '@/Components/ui/button';
import { useChat } from '@/Providers/ChatProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatOverlay() {
  const { chatSetting, setChatSetting } = useChat();

  return (
    <AnimatePresence>
      { chatSetting?.component && (
        <motion.div
          key="chat-overlay"
          className="absolute bottom-0 left-2 right-2 z-20 flex h-[calc(100%-52px)] flex-col overflow-y-auto rounded bg-white shadow"
          initial={ { scale: 0, y: '100%' } }
          animate={ { scale: 1, y: 0 } }
          transition={ {
            type: 'spring',
            duration: 0.3,
            bounce: 0.25,
          } }
          exit={ { scale: 0, y: '100%' } }>
          <div className="flex items-center justify-between border-b border-brand-gray-15/50 px-4 py-2">
            { chatSetting.header && <h2 className="font-bold">{ chatSetting.header }</h2> }
            <Button variant="ghost" onClick={ () => setChatSetting( null ) } className="-mr-2">
              <CloseIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-4">{ chatSetting.component }</div>
        </motion.div>
      ) }
    </AnimatePresence>
  );
}
