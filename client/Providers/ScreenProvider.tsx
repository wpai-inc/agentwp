import { createContext, useContext, useEffect } from 'react';

type ScreenType = {
  url: string;
  title: string;
  links: string[];
  //   buttons: string[];
  //   forms: { action: string; method: string }[];
};

const ScreenContext = createContext<ScreenType>({
  url: '',
  title: '',
  links: [],
  //   buttons: [],
  //   forms: [],
});

export function useScreen() {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }
  return context;
}

export default function ScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let screen: ScreenType = {
    url: '',
    title: '',
    links: [],
    // buttons: [],
    // forms: [],
  };

  useEffect(() => {
    screen.url = window.location.href;
    screen.title = document.title;

    screen.links = Array.from(document.links).map((link) => link.href);

    // screen.buttons = Array.from(document.querySelectorAll('button')).map(
    //   (button) => button.innerText,
    // );

    // screen.forms = Array.from(document.forms).map((form) => ({
    //   action: form.action,
    //   method: form.method,
    // }));
  }, []);

  return (
    <ScreenContext.Provider value={screen}>{children}</ScreenContext.Provider>
  );
}
