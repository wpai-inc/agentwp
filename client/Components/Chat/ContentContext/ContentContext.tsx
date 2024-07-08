import { useInputSelect } from '@/Providers/InputSelectProvider';

export default function ContentContext() {
  const { selectedInput, setSelectedInput } = useInputSelect();
  return (
    <>
      {selectedInput && (
        <div className="absolute bottom-full left-0 z-50 w-full bg-purple-200 p-2 ">
          Selected input: <strong>{selectedInput?.label}</strong>
          <div
            className="absolute right-1 top-1 cursor-pointer"
            onClick={() => setSelectedInput(null)}>
            x
          </div>
        </div>
      )}
    </>
  );
}
