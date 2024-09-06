import { useDocIndexStatus } from '@/Providers/DocIndexStatusProvider';
import { AnimatePresence, motion } from 'framer-motion';
import DocIndexProgress from './DocIndexProgress';

export default function DocIndexStatus() {
  const { done } = useDocIndexStatus();

  if ( ! done ) {
    return (
      <AnimatePresence>
        <motion.div
          initial={ { opacity: 0, y: -10 } }
          animate={ { opacity: 1, y: 0 } }
          exit={ { opacity: 0, y: -10 } }
          transition={ { duration: 0.2 } }
          className="px-4 text-brand-gray-70">
          <DocIndexProgress />
        </motion.div>
      </AnimatePresence>
    );
  }
}
