import { Spinner } from '@/Components/Spinner';

export default function LoadingScreen() {
  return (
    <div className="h-full flex-col flex justify-center items-center">
      <div className="items-center flex gap-3">
        <Spinner show={ true } />
        <h1 className="font-bold text-gray-400 text-sm">Loading...</h1>
      </div>
    </div>
  );
}
