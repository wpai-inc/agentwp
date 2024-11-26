import { useEffect, useState } from 'react';
import axios from 'axios';
import { CardListItemProps } from './CardListItem';
import { CardList } from './CardList';
import type { WpPost } from '@/Types/types';
import { useTranslation } from 'react-i18next';

export default function ChangelogFeed() {
  const { t } = useTranslation();
  const feedUrl = 'https://agentwp.com/wp-json/wp/v2/change/';
  const [ items, setItems ] = useState< WpPost[] >( [] );

  useEffect( function () {
    getFeed();
  }, [] );

  async function getFeed() {
    try {
      const response = await axios.get( feedUrl );
      setItems( response.data );
    } catch ( error ) {
      console.error( error );
    }
  }

  return items.length > 0 ? <PostList items={ items } /> : <p>{ t( 'Nothing yet!' ) }</p>;
}

function PostList( { items }: { items: WpPost[] } ) {
  const list: CardListItemProps[] = items.map( item => ( {
    href: item.link,
    children: item.title.rendered,
    target: '_blank',
  } ) );

  return <CardList items={ list } />;
}
