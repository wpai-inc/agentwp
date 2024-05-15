import { usePage } from '@/Providers/PageProvider';

interface LogoProps {
  className: string | undefined;
}

export function Logo({ className }: LogoProps) {
  const page = usePage();
  return (
    <img
      className={className}
      src={page.plugin_url + '/assets/images/awp.png'}
      alt="Agent WP"
    />
  );
}
