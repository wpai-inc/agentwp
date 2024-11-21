import { CardList } from '@/Components/Admin/CardList';
import { useTranslation } from 'react-i18next';

type QuickLink = {
  title: string;
  url: string;
};

export default function QuickLinks() {
  const { t } = useTranslation();
  const links: QuickLink[] = [
    {
      title: t( 'All Agents' ),
      url: 'app.agentwp.com',
    },
    {
      title: t( 'Billing' ),
      url: 'app.agentwp.com/billing',
    },
    {
      title: t( 'Agent Settings' ),
      url: 'tab',
    },
    {
      title: t( 'Changes and Updates' ),
      url: 'agentwp.com/blog',
    },
    {
      title: t( 'AgentWP Blog' ),
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
