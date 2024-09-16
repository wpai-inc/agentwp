import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import IconUp from '@material-design-icons/svg/outlined/arrow_upward.svg?react';

export default function WaitlistTab() {
  const [ input, setInput ] = useState< string >( 'Anything' );

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-white/50 items-center flex flex-col justify-center">
        <div className="p-8 space-y-4 text-center max-w-md flex flex-col">
          <h2 className="text-3xl font-semibold">Search { input } WordPress</h2>
          <p>You’re on the waitlist... Search Anything WordPress will be available soon.</p>
          <a
            href="https://agentwp.com/search"
            target="_blank"
            className="underline underline-offset-4 hover:text-brand-primary">
            Learn More
          </a>
          <form
            className="p-4 bg-brand-gray text-brand-gray-50 focus-within:ring-2 ring-brand-primary transition rounded ring-inset"
            aria-disabled>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Search for anything"
                className="bg-transparent focus:ring-0 flex-1 text-xl text-brand-dark placeholder-brand-gray-50"
                value={ input }
                onChange={ e => setInput( e.target.value ) }
              />
              <Button disabled variant="brand" size="lg" className="rounded h-10 w-10">
                <IconUp className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
