import NavigatableButton from '@/Components/NavigatableButton';
import type { Button } from '@/Components/NavigatableButton/NavigatableButton';

export default function Buttons( { buttons }: { buttons: Button[] } ) {
  return (
    <div className="flex gap-2 items-center mt-2">
      { buttons.map( b => (
        <NavigatableButton text={ b.label } link={ b.url } styleType={ b.level } />
      ) ) }
    </div>
  );
}
