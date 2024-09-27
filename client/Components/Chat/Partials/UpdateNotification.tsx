import { useEffect, useState } from 'react';
import IconClose from '@material-design-icons/svg/outlined/close.svg?react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import type { AxiosPromise } from 'axios';
import type { WpPost } from '@/Types/types';
import { ChatNotice } from '../Notices/ChatNotice';

type ChangelogUpdate = {
  title: string;
  link: string;
};

export default function UpdateNotification() {
  const { settings, updateSetting } = useClientSettings();
  const feedUrl = 'https://agentwp.com/wp-json/wp/v2/change/';
  const [ update, setUpdate ] = useState< ChangelogUpdate | null >( null );
  const isDismissed =
    settings.updateDismissed !== null && settings.updateDismissed === update?.link;

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
    if ( update ) {
      updateSetting( 'updateDismissed', update.link );
    }
  }

  return (
    ! isDismissed &&
    update && (
      <div className="mx-2 mb-2">
        <ChatNotice
          variant="informative"
          onDismiss={ dismiss }
          size="sm"
          action={
            <a href={ update.link } target="_blank" className="underline underline-offset-2">
              Learn More
            </a>
          }>
          <span>New: { update.title }</span>
        </ChatNotice>
      </div>
    )
  );
}
