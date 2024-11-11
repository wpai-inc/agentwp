import { useApp } from '@/Providers/AppProvider';
import ChatOff from '@/Components/Chat/ChatOff';
import root from 'react-shadow';
import styles from '@/assets/styles/inline-app.css?inline';

export default function AppWrapper( { children }: { children: React.ReactNode } ) {
  const app = useApp();

  if ( app.turnedOff ) {
    return <ChatOff />;
  }

  return (
    <root.div>
      { children }
      <style type="text/css">{ styles }</style>
    </root.div>
  );
}
