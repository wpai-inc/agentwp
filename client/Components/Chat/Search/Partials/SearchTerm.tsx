import ChatHeading from '../../Partials/ChatHeading';
import { motion } from 'framer-motion';

export default function SearchTerm( { term }: { term: string } ) {
  return (
    <motion.div
      initial={ { opacity: 0, y: -10 } }
      animate={ { opacity: 1, y: 0 } }
      exit={ { opacity: 0, y: -10 } }
      className="bg-brand-gray p-4 pb-6 rounded-md space-y-2">
      <ChatHeading explanation="The natural language query you enter to find specific content or information on your WordPress site.">
        Search Term
      </ChatHeading>
      <blockquote className="text-3xl text-black">"{ term }"</blockquote>
    </motion.div>
  );
}
