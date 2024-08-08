import { createContext, useContext, useEffect, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { useClient } from '@/Providers/ClientProvider';
import type { streamableFieldType } from '@/Types/types';

type postContentType = {
  post_content: string;
  post_title: string;
};

type ScreenType = {
  url: string;
  title: string;
  links: string[];
  screenshot?: string;
  post?: postContentType;
  selectedInput?: streamableFieldType;
};

type ScreenContextType = {
  screen: ScreenType;
  setScreen: ( screen: ScreenType ) => void;
};

const ScreenContext = createContext< ScreenContextType >( {
  screen: {
    url: '',
    title: '',
    links: [],
    screenshot: '',
  },
  setScreen: () => {},
} );

export function useScreen() {
  const context = useContext( ScreenContext );
  if ( ! context ) {
    throw new Error( 'useScreen must be used within a ScreenProvider' );
  }
  return context;
}

async function getScreenshot(): Promise< string > {
  const node = document.body;

  if ( node ) {
    const filter = ( node: HTMLElement ) => {
      return node.id !== 'agentwp-admin-chat';
    };

    return await toJpeg( node, { quality: 0.5, filter } );
  } else {
    console.error( 'Problemo.' );
    return '';
  }
}

export default function ScreenProvider( { children }: { children: React.ReactNode } ) { 
  const { getSettings } = useClient();
  const [ enabled, setEnabled ] = useState< boolean | undefined >( undefined );
  const [ screen, setScreen ] = useState< ScreenType >( {
    url: '',
    title: '',
    links: [],
    screenshot: '',
  } );

  const screenshotSetting = async () => {
    const settings = await getSettings();
    const enabled = settings.find( ( setting: any ) => setting.name === 'screenshotsEnabled' );
    if (enabled === undefined || typeof enabled.value !== 'boolean') {
      setEnabled( false );
    }

    setEnabled( enabled.value );
  }

  useEffect( () => {
    screenshotSetting();
  }, [] );

  useEffect( () => {
    const fetchData = async ( enabled: boolean ) => {
      const url = window.location.href;
      const title = document.title;
      const links = Array.from( document.links ).map( link => link.href );
      const screenshot = enabled ? await getScreenshot() : '';

      setScreen( {
        url,
        title,
        links,
        screenshot,
      } );
    };

    if ( enabled !== undefined ) {
      fetchData( enabled );
    }
  }, [enabled] );

  return (
    <ScreenContext.Provider value={ { screen, setScreen } }>{ children }</ScreenContext.Provider>
  );
}
