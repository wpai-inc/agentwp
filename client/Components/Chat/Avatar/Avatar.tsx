import { cn } from '@/lib/utils';

export default function Avatar( {
  name,
  time,
  image,
  className,
}: {
  name: string;
  time: string;
  image?: string;
  className?: string;
} ) {
  return (
    <div className="flex gap-2 items-center">
      { image ? (
        <img src={ image } alt={ name } className={ cn( 'w-9 h-9 rounded-full', className ) } />
      ) : (
        <div className="w-8 h-8 flex items-center justify-center font-bold bg-white rounded-full">
          { name }
        </div>
      ) }

      <div className="flex flex-col justify-center">
        <h3 className="font-bold text-sm">{ name }</h3>
        <time className="text-xs">{ time }</time>
      </div>
    </div>
  );
}
