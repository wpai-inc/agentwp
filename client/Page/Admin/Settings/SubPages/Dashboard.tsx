import { cn } from '@/lib/utils';
import ChatApp from '@/Components/Chat';

function Card( {
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} ) {
  return (
    <div className={ cn( 'bg-white rounded-md p-4', className ) } { ...rest }>
      { children }
    </div>
  );
}
export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="col-span-3">
        <div className="grid grid-cols-3 gap-5">
          <Card className="col-span-3">Dismissable admin alert</Card>
          <div className="col-span-2">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/Ur3LOqwD7ZA?si=IKM3WBy12oy42LnX"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <Card className="col-span-1 row-span-2">Recent conversations</Card>
          <Card className="col-span-1">Changelog</Card>
          <Card className="col-span-1">Quicklinks</Card>
        </div>
      </div>

      <ChatApp />
    </div>
  );
}
