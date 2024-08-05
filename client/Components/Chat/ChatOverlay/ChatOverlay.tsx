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
          className="bg-white absolute shadow rounded z-20 w-[calc(100%-1rem)] m-[0.5rem] h-[calc(100%-1rem)]"
          initial={ { scale: 0, y: '100%' } }
          animate={ { scale: 1, y: 0 } }
          exit={ { scale: 0, y: '100%' } }>
          <div className="py-2 px-4 flex items-center justify-between border-b border-brand-gray-15/50">
            { chatSetting.header && <h2 className="font-bold">{ chatSetting.header }</h2> }
            <Button variant="ghost" onClick={ () => setChatSetting( null ) } className="-mr-2">
              <CloseIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="py-6 px-4">{ chatSetting.component }</div>
        </motion.div>
      ) }
    </AnimatePresence>
  );
}
