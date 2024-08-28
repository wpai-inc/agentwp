import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';
import { TokenUsageStatus } from '@/Types/enums';
import { buttonVariants } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { usePage } from '@/Providers/PageProvider';

interface OverCapacityProps {
  cooldownTime: Date | null;
  tokenUsageStatus: TokenUsageStatus;
}

export default function OverCapacity( props: OverCapacityProps ) {
  const { page } = usePage();

  return (
    <Alert
      variant="default"
      className={ cn(
        'w-full rounded-lg text-base border-none flex justify-between items-center',
      ) }>
      <div>
        <AlertTitle>Free message limit reached.</AlertTitle>
        { props.cooldownTime && (
          <AlertDescription>
            Please get back at{ ' ' }
            { new Intl.DateTimeFormat( 'en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            } ).format( new Date( props.cooldownTime ) ) }
            .
          </AlertDescription>
        ) }
      </div>
      <a
        className={ cn(
          buttonVariants( {
            variant: 'default',
            className: 'rounded-full bg-brand-primary px-3',
          } ),
        ) }
        href={ page.account.upgrade_link }>
        Upgrade now
      </a>
    </Alert>
  );
}
