import { AgentTooltip } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import IconHelp from '@material-design-icons/svg/outlined/help.svg?react';

export default function ChatHeading( {
  children,
  className,
  explanation,
}: {
  children: React.ReactNode;
  className?: string;
  explanation?: string;
} ) {
  return (
    <div className="flex items-center gap-1 text-brand-dark/60">
      <h3
        className={ cn(
          'text-brand-dark/60 text-xs uppercase tracking-wide font-bold',
          className,
        ) }>
        { children }
      </h3>
      { explanation && (
        <AgentTooltip content={ explanation }>
          <button>
            <IconHelp className="w-3 h-3" />
          </button>
        </AgentTooltip>
      ) }
    </div>
  );
}
