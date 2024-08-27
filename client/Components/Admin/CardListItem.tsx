import { cn } from '@/lib/utils';
import IconLink from '@material-design-icons/svg/outlined/open_in_new.svg?react';

export type CardListItemProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
};

export function CardListItem( { children, className, href, ...rest }: CardListItemProps ) {
  return (
    <li className="group">
      <a
        href={ href }
        className={ cn(
          'group-odd:bg-brand-gray-20 bg-white block rounded-md px-3 py-1.5 text-sm leading-snug hover:!bg-brand-primary hover:text-white transition flex items-center',
          className,
        ) }
        { ...rest }>
        <span className="flex-1">{ children }</span>
        <IconLink className="w-4 h-4 ml-4 opacity-50" />
      </a>
    </li>
  );
}
