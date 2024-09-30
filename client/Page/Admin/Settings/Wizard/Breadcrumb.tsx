import { Fragment } from 'react';
import { StepType } from '../Wizard';
import { cn } from '@/lib/utils';
import IconCheck from '@material-design-icons/svg/outlined/check_circle.svg?react';
import IconCheckCompleted from '@material-design-icons/svg/filled/check_circle.svg?react';

export default function Breadcrumb( {
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: StepType[];
} ) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      { steps.map( ( step, index ) => {
        const props = {
          state:
            currentStep === index
              ? 'active'
              : currentStep > index
              ? 'completed'
              : ( 'next' as StepState ),
          title: step.text,
        };
        return (
          <Fragment key={ index }>
            <Step { ...props } />
            { index < steps.length - 1 && <Divider /> }
          </Fragment>
        );
      } ) }
    </div>
  );
}

type StepState = 'completed' | 'active' | 'next';

function Step( { title, state }: { title: string; state: StepState } ) {
  return (
    <span
      className={ cn( 'flex items-center gap-1', {
        'opacity-50': state !== 'active',
      } ) }>
      { state === 'completed' ? (
        <IconCheckCompleted className="h-4 w-4" />
      ) : (
        <IconCheck className="h-4 w-4" />
      ) }
      { title }
    </span>
  );
}

function Divider() {
  return <span className="block h-0.5 w-4 bg-black/10" />;
}
