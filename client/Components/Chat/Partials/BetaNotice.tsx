import IconClose from '@material-design-icons/svg/outlined/close.svg?react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function BetaNotice() {
  const { settings, updateSetting } = useClientSettings();
  const { t } = useTranslation();

  function dismiss() {
    updateSetting( 'betaDismissed', true );
  }

  return (
    <AnimatePresence>
      { ! settings.betaDismissed && (
        <motion.div
          initial={ { opacity: 0, y: '-100%' } }
          animate={ { opacity: 1, y: 0 } }
          exit={ { opacity: 0, y: '-100%' } }
          className="flex items-center justify-between bg-brand-gray px-4 py-1.5 text-sm font-medium text-brand-gray-70">
          <h2>{ t( 'Beta Testing – Read Only Mode' ) }</h2>
          <div className="flex items-center gap-2">
            <a
              href="https://agentwp.com/beta"
              target="_blank"
              className="underline underline-offset-2">
              { t( 'Learn more' ) }
            </a>
            <button className="rounded p-1 transition hover:bg-white/20" onClick={ dismiss }>
              <IconClose className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ) }
    </AnimatePresence>
  );
}
