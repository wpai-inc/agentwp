type QuickLink = {
  title: string;
  url: string;
};

export default function QuickLinks() {
  const links: QuickLink[] = [
    {
      title: 'Lorem',
      url: 'https://example.com',
    },
    {
      title: 'Ipsum',
      url: 'https://example.com',
    },
    {
      title: 'Dolor',
      url: 'https://example.com',
    },
    {
      title: 'Sit',
      url: 'https://example.com',
    },
    {
      title: 'Amet',
      url: 'https://example.com',
    },
  ];
  return (
    <ul>
      { links.map( ( link, key ) => (
        <li key={ key }>
          <a href={ link.url } target="_blank" rel="noreferrer">
            { link.title }
          </a>
        </li>
      ) ) }
    </ul>
  );
}
