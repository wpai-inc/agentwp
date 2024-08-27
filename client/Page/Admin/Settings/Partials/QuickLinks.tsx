import { CardList } from '@/Components/Admin/CardList';

type QuickLink = {
  title: string;
  url: string;
};

export default function QuickLinks() {
  const links: QuickLink[] = [
    {
      title: 'All Agents',
      url: 'app.agentwp.com',
    },
    {
      title: 'Billing',
      url: 'app.agentwp.com/billing',
    },
    {
      title: 'Agent Settings',
      url: 'tab',
    },
    {
      title: 'Changes and Updates',
      url: 'agentwp.com/blog',
    },
    {
      title: 'AgentWP Blog',
      url: 'agentwp.com/blog',
    },
  ];
  return (
    <CardList
      items={ links.map( link => ( {
        href: link.url,
        children: link.title,
        target: '_blank',
        rel: 'noreferrer',
      } ) ) }
    />
  );
}
