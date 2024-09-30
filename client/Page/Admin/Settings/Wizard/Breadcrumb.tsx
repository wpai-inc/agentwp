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
    <div className="flex justify-center items-center gap-3 mt-8">
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
          <>
            <Step key={ index } { ...props } />
            { index < steps.length - 1 && <Divider /> }
          </>
        );
      } ) }
    </div>
  );
}

type StepState = 'completed' | 'active' | 'next';

function Step( { title, state }: { title: string; state: StepState } ) {
  return (
    <span
      className={ cn( 'flex gap-1 items-center', {
        'opacity-50': state !== 'active',
      } ) }>
      { state === 'completed' ? (
        <IconCheckCompleted className="w-4 h-4" />
      ) : (
        <IconCheck className="w-4 h-4" />
      ) }
      { title }
    </span>
  );
}

function Divider() {
  return <span className="h-0.5 w-4 bg-black/10 block" />;
}
