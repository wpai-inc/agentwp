import { useDocIndexStatus } from '@/Providers/DocIndexStatusProvider';
import { AnimatePresence, motion } from 'framer-motion';
import DocIndexProgress from './DocIndexProgress';
import DocIndexStart from './DocIndexStart';

export default function DocIndexStatus() {
  const { done, hasIndexed } = useDocIndexStatus();

  return (
    <AnimatePresence>
      <motion.div
        initial={ { opacity: 0, y: -10 } }
        animate={ { opacity: 1, y: 0 } }
        exit={ { opacity: 0, y: -10 } }
        transition={ { duration: 0.2 } }
        className="px-4 text-brand-gray-70">
        { ! done ? <DocIndexProgress /> : ! hasIndexed ? <DocIndexStart /> : null }
      </motion.div>
    </AnimatePresence>
  );
}
