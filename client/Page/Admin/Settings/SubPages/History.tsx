import ChatApp from '@/Components/Chat';
import LatestConvos from '../../DashboardWidget/Partials/LatestConvos';
import { Card } from '@/Components/Admin/Card';

export default function History() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="History" className="col-span-full md:col-span-1">
        <LatestConvos />
      </Card>
      <div className="col-span-full md:col-span-1">
        <ChatApp inline={ true } />
      </div>
    </div>
  );
}
