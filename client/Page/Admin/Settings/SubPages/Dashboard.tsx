import ChatApp from '@/Components/Chat';
import LatestConvos from '../../DashboardWidget/Partials/LatestConvos';
import { Card } from '@/Components/Admin/Card';
import ChangelogFeed from '@/Components/Admin/ChangelogFeed';
import QuickLinks from '../Partials/QuickLinks';

export default function Dashboard() {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-5">
      <div className="grid grid-cols-3 gap-5 h-full flex-1">
        <div className="col-span-full xl:col-span-2">
          <iframe
            className="w-full h-full aspect-video"
            src="https://www.youtube.com/embed/Ur3LOqwD7ZA?si=IKM3WBy12oy42LnX"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <Card title="Recent conversations" className="col-span-full lg:col-span-1 row-span-2">
          <LatestConvos />
        </Card>
        <Card title="Changelog" className="col-span-full lg:col-span-1">
          <ChangelogFeed />
        </Card>
        <Card title="Quicklinks" className="col-span-full lg:col-span-1">
          <QuickLinks />
        </Card>
      </div>
      <div className="flex-shrink">
        <ChatApp inline={ true } />
      </div>
    </div>
  );
}
