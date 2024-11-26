import { Spinner } from '@/Components/Spinner';
import { useTranslation } from 'react-i18next';

export default function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <div className="h-full flex-col flex justify-center items-center">
      <div className="items-center flex gap-3">
        <Spinner show={ true } />
        <h1 className="font-bold text-gray-400 text-sm">{ t( 'Loading...' ) }</h1>
      </div>
    </div>
  );
}
