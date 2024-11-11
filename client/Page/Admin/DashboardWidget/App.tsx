import root from 'react-shadow';
import styles from '@/assets/styles/inline-app.css?inline';
import LatestConvos from './Partials/LatestConvos';
import Footer from './Partials/Footer';

export default function App() {
  const wpWidgetStyleReset = { margin: '-11px -12px -12px -12px' };

  return (
    <root.div style={ wpWidgetStyleReset }>
      <style type="text/css">{ styles }</style>
      <LatestConvos />
      <Footer />
    </root.div>
  );
}
