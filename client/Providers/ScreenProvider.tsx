import { createContext, useContext, useEffect, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { useAccountSettings } from '@/Providers/AccountSettingsProvider';

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
  selectedInput?: App.Data.StreamableFieldData;
};

type ScreenContextType = {
  screen: ScreenType;
  setScreen: ( screen: ScreenType ) => void;
  getScreenshot: () => void;
};

const ScreenContext = createContext< ScreenContextType >( {
  screen: {
    url: '',
    title: '',
    links: [],
    screenshot: '',
  },
  setScreen: () => {},
  getScreenshot: () => {},
} );

export function useScreen() {
  const context = useContext( ScreenContext );
  if ( ! context ) {
    throw new Error( 'useScreen must be used within a ScreenProvider' );
  }
  return context;
}

export default function ScreenProvider( { children }: { children: React.ReactNode } ) {
  const { getAccountSetting, accountSettings } = useAccountSettings();

  const url = window.location.href;
  const title = document.title;
  const links = Array.from( document.links ).map( link => link.href );

  const [ screen, setScreen ] = useState< ScreenType >( {
    url,
    title,
    links,
    screenshot: '',
  } );

  async function getScreenshot() {
    if ( getAccountSetting( 'visionEnabled' ).value ) {
      const node = document.body;

      if ( node ) {
        const filter = ( node: Node ): boolean => {
          if ( node instanceof HTMLElement ) {
            return (
              node.id !== 'agentwp-admin-chat' &&
              node.id !== 'site-icon-preview' &&
              ! node.classList.contains( 'avatar' ) &&
              ! node.classList.contains( 'editor-visual-editor' ) &&
              ! ( node instanceof HTMLInputElement && node.type === 'email' ) &&
              ! ( node instanceof HTMLInputElement && node.type === 'password' )
            );
          }
          return true;
        };

        const screenshot = await toJpeg( node, {
          quality: 0.5,
          filter,
        } ).catch( e => {
          console.error( 'Screenshot cannot be taken', e );
          return '';
        } );

        setScreen( { ...screen, screenshot } );
        return screenshot;
      } else {
        console.error( 'Screenshot cannot be taken; document.body does not exists' );
        setScreen( { ...screen, screenshot: '' } );
        return '';
      }
    } else {
      setScreen( { ...screen, screenshot: '' } );
      return '';
    }
  }

  useEffect( () => {
    getScreenshot();
  }, [ accountSettings ] );

  return (
    <ScreenContext.Provider value={ { screen, setScreen, getScreenshot } }>
      { children }
    </ScreenContext.Provider>
  );
}
