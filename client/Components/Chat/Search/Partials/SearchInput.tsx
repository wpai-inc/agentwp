import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import IconUp from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import { useSearch } from '@/Providers/SearchProvider';

export default function SearchInput() {
  const { search } = useSearch();
  const [ input, setInput ] = useState< string >( '' );

  function submit( e: React.FormEvent ) {
    e.preventDefault();
    search( input );
    setInput( '' );
  }

  return (
    <div className="mt-2 mb-0 max-w-screen-md mx-auto px-2 w-full">
      <form
        className="p-4 bg-brand-gray text-brand-gray-50 focus-within:ring-2 ring-brand-primary transition rounded ring-inset"
        onSubmit={ submit }>
        <div className="flex items-center">
          <input
            type="search"
            placeholder="Search for anything"
            className="bg-transparent focus:ring-0 flex-1 text-xl text-brand-dark placeholder-brand-gray-50"
            value={ input }
            onChange={ e => setInput( e.target.value ) }
          />
          <Button variant="brand" size="lg" className="rounded h-10 w-10">
            <IconUp className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
