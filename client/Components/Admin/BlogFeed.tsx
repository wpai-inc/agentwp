import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BlogFeed() {
  const feedUrl = 'https://agentwp.com/feed/';
  const [ items, setItems ] = useState< string[] >();

  useEffect( () => {
    const feed = getFeed();
    // setItems( feed );
  }, [] );

  async function getFeed() {
    try {
      const response = await axios.get( feedUrl );
      console.log( response );
    } catch ( error ) {
      console.error( error );
    }
  }

  return (
    <ul>
      { /* { items.map( ( item, key ) => (
        <li key={ key }>{ item }</li>
      ) ) } */ }
    </ul>
  );
}
