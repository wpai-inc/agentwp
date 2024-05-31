import '@/assets/styles/app.css';

export default function App({ children }: { children: React.ReactNode }) {
  return children;
}

export const DEFAULT_CHAT_WINDOW_HEIGHT = '90vh';
export const DEFAULT_CHAT_WINDOW_WIDTH = '400px';

export function getDefaultWindowHeight(): number  {
  return Number(DEFAULT_CHAT_WINDOW_HEIGHT.replace('vh', ''));
}

export function getDefaultWindowWidth(): number {
  return Number(DEFAULT_CHAT_WINDOW_WIDTH.replace('px', ''));
}
