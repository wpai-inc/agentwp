import { useEffect, useState } from 'react';
import IconClose from '@material-design-icons/svg/outlined/close.svg?react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import type { AxiosPromise } from 'axios';
import type { WpPost } from '@/Types/types';

type ChangelogUpdate = {
  title: string;
  link: string;
};

export default function UpdateNotification() {
  const { settings, updateSetting } = useClientSettings();
  const feedUrl = 'https://agentwp.com/wp-json/wp/v2/change/';
  const [ update, setUpdate ] = useState< ChangelogUpdate | null >( null );

  useEffect( function () {
    async function fetchUpdate() {
      const latest = await getChangelog();
      if ( latest && latest.data.length > 0 ) {
        const log = latest.data[ 0 ];
        setUpdate( {
          title: log.title.rendered,
          link: log.link,
        } );
      }
    }
    fetchUpdate();
  }, [] );

  async function getChangelog(): Promise< AxiosPromise< WpPost[] > | undefined > {
    try {
      return await axios.get( feedUrl );
    } catch ( error ) {
      console.error( error );
    }
  }

  function dismiss() {
    updateSetting( 'updateDismissed', true );
  }

  return (
    <AnimatePresence>
      { ! settings.updateDismissed && update !== null && (
        <motion.div
          initial={ { opacity: 0, y: '-100%' } }
          animate={ { opacity: 1, y: 0 } }
          exit={ { opacity: 0, y: '-100%' } }
          className="bg-brand-secondary-muted flex items-center justify-between px-4 py-1.5 text-sm font-medium text-white">
          <h2 className="text-white">New: { update.title }</h2>
          <div className="flex items-center gap-2">
            <a href={ update.link } target="_blank" className="underline underline-offset-2">
              Learn More
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
