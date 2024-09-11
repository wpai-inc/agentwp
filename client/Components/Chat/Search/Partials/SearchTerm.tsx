import { useSearch } from '@/Providers/SearchProvider';
import ChatHeading from '../../Partials/ChatHeading';
import { motion } from 'framer-motion';
import IconRemove from '@material-design-icons/svg/outlined/remove.svg?react';

export default function SearchTerm( { term }: { term: string } ) {
  const { resetQuery } = useSearch();
  return (
    <motion.div
      initial={ { opacity: 0, y: -10 } }
      animate={ { opacity: 1, y: 0 } }
      exit={ { opacity: 0, y: -10 } }
      className="space-y-2 rounded-md bg-brand-gray p-4 pb-6">
      <div className="flex items-center justify-between">
        <ChatHeading explanation="The natural language query you enter to find specific content or information on your WordPress site.">
          Search Term
        </ChatHeading>
        <button onClick={ resetQuery }>
          <IconRemove className="h-5 w-5" />
        </button>
      </div>
      <blockquote className="text-3xl text-black">"{ term }"</blockquote>
    </motion.div>
  );
}
