import IconCopy from '@material-design-icons/svg/outlined/content_copy.svg?react';
import useCopy from '@/Hooks/copy';

export default function CodeToolbar( { code, language }: { code: string; language: string } ) {
  const { copy, copied } = useCopy();

  return (
    <div className="flex justify-between p-2 bg-brand-gray-25 text-brand-gray-70 rounded-t-xl">
      <span className="text-sm uppercase">{ language }</span>
      <button className="ml-2 text-xs hover:text-brand-gray-100" onClick={ () => copy(code) }>
        { copied ? 'Copied!' : <IconCopy className="w-4 h-4" /> }
      </button>
    </div>
  );
}
