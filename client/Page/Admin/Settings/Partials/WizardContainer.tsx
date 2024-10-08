import { cn } from '@/lib/utils';

export default function WizardContainer( {
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
} ) {
  return <div className={ cn( 'max-w-lg mx-auto mt-12', className ) }>{ children }</div>;
}
