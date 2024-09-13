import { createContext, useContext, useEffect, useState } from 'react';
import { toJpeg } from 'html-to-image';
import type { StreamableFieldType } from '@/Types/types';
import { usePage } from './PageProvider';

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
  selectedInput?: StreamableFieldType;
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
  const { getAccountSetting } = usePage();
  const [ screen, setScreen ] = useState< ScreenType >( {
    url: '',
    title: '',
    links: [],
    screenshot: '',
  } );

  useEffect( () => {
    const fetchData = async () => {
      const url = window.location.href;
      const title = document.title;
      const links = Array.from( document.links ).map( link => link.href );
      const screenshot = getAccountSetting( 'visionEnabled' ) ? await getScreenshot() : '';

      setScreen( {
        url,
        title,
        links,
        screenshot,
      } );
    };

    fetchData();
  }, [] );

  return (
    <ScreenContext.Provider value={ { screen, setScreen } }>{ children }</ScreenContext.Provider>
  );
}
