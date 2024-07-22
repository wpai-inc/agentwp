import { createContext, useContext, useEffect, useState } from 'react';
import { toJpeg } from 'html-to-image';

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
  //   buttons: string[];
  //   forms: { action: string; method: string }[];
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
    // buttons: [],
    // forms: [],
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
  //depending on the request, we can either do a full screen or viewport-specific screenshot
  if ( node ) {
    return await toJpeg( node, { quality: 0.5 } );
  } else {
    console.error( 'Problemo.' );
    return '';
  }
}

export default function ScreenProvider( { children }: { children: React.ReactNode } ) {
  const [ screen, setScreen ] = useState< ScreenType >( {
    url: '',
    title: '',
    links: [],
    // buttons: [],
    // forms: [],
  } );

  useEffect( () => {
    const fetchData = async () => {
      const url = window.location.href;
      const title = document.title;
      const links = Array.from( document.links ).map( link => link.href );
      const screenshot = await getScreenshot();
      // screen.buttons = Array.from(document.querySelectorAll('button')).map(
      //   (button) => button.innerText,
      // );

      // screen.forms = Array.from(document.forms).map((form) => ({
      //   action: form.action,
      //   method: form.method,
      // }));

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
