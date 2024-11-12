import { useApp } from '@/Providers/AppProvider';
import ChatOff from '@/Components/Chat/ChatOff';

export default function AppWrapper( { children }: { children: React.ReactNode } ) {
  const app = useApp();

  return app.turnedOff ? <ChatOff /> : children;
}
