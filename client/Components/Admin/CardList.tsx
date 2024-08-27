import { CardListItem } from './CardListItem';
import { CardListItemProps } from './CardListItem';

export function CardList( {
  items,
  children,
  ...rest
}: {
  items?: CardListItemProps[];
  children?: React.ReactNode;
} ) {
  return (
    <ul { ...rest }>
      { items?.map( ( item, index ) => <CardListItem key={ index } { ...item } /> ) }
      { children }
    </ul>
  );
}
