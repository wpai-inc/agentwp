import { useEffect, useState } from 'react';
import axios from 'axios';
import { CardListItemProps } from './CardListItem';
import { CardList } from './CardList';

type Post = {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    footnotes: string;
  };
  categories: number[];
  tags: number[];
};

export default function BlogFeed() {
  const feedUrl = 'https://agentwp.com/wp-json/wp/v2/posts/';
  const [ items, setItems ] = useState< Post[] >( [] );

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

  return items.length > 0 ? <PostList items={ items } /> : <p>Not Posts</p>;
}

function PostList( { items }: { items: Post[] } ) {
  const list: CardListItemProps[] = items.map( item => ( {
    href: item.link,
    children: item.title.rendered,
    target: '_blank',
  } ) );

  return <CardList items={ list } />;
}
