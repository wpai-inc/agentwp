import { createContext, useContext, useEffect, useState } from 'react';

type ScreenType = {
  url: string;
  title: string;
  links: string[];
  post_content: string;
  //   buttons: string[];
  //   forms: { action: string; method: string }[];
};

type ScreenContextType = {
  screen: ScreenType;
  setScreen: ( screen: ScreenType ) => void;
};

const ScreenContext = createContext< ScreenContextType >( {
  url: '',
  title: '',
  links: [],
  post_content: '',
  //   buttons: [],
  //   forms: [],
} );

export function useScreen() {
  const context = useContext( ScreenContext );
  if ( ! context ) {
    throw new Error( 'useScreen must be used within a ScreenProvider' );
  }
  return context;
}

export default function ScreenProvider( { children }: { children: React.ReactNode } ) {
  const [ screen, setScreen ] = useState< ScreenType >( {
    url: '',
    title: '',
    links: [],
    post_content: '',
    // buttons: [],
    // forms: [],
  } );

  useEffect( () => {
    setScreen( {
      url: window.location.href,
      title: document.title,
      links: Array.from( document.links ).map( link => link.href ),
      post_content: '',
    } );

    // screen.buttons = Array.from(document.querySelectorAll('button')).map(
    //   (button) => button.innerText,
    // );

    // screen.forms = Array.from(document.forms).map((form) => ({
    //   action: form.action,
    //   method: form.method,
    // }));
  }, [] );

  return (
    <ScreenContext.Provider value={ { screen, setScreen } }>{ children }</ScreenContext.Provider>
  );
}
