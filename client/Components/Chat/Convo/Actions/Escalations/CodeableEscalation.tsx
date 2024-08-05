import { MessageActionEscalation } from '@wpai/schemas';
import { useEscalation } from '@/Providers/EscalationProvider';
import CodeableLogo from '@/assets/services/codeable.png';
import { LoaderIcon } from 'lucide-react';

type Props = {
  escalation: MessageActionEscalation;
};

const CodeableEscalation = ( { escalation }: Props ) => {
  const { createEscalation, loading } = useEscalation();

  function handleContinue() {
    createEscalation();
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden p-3 bg-[#E8E8E9] mt-3">
        <div className="flex items-center mb-1">
          <div className="flex-shrink-0">
            <img className="w-4 h-4" src={ CodeableLogo } alt="Codeable" />
          </div>
          <div className="ml-1.5">
            <div className="text-sm text-neutral-500">{ escalation.name }</div>
          </div>
        </div>
        <div className="font-semibold text-sm mb-2 text-gray-800">{ escalation.headline }</div>
        <p className="text-gray-700 text-sm">
          { escalation.description }{ ' ' }
          { escalation.link ? (
            <a href={ escalation.link } className="text-blue-500 hover:underline">
              View Full Scope.
            </a>
          ) : (
            <button
              onClick={ handleContinue }
              disabled={ loading }
              className="text-blue-500 hover:underline">
              View Full Scope.
            </button>
          ) }
        </p>
      </div>
      { escalation.link ? (
        <a
          href={ escalation.link }
          className={
            'p-2 rounded-lg w-full text-sm justify-center items-center text-white flex bg-[#457580] hover:opacity-80 min-h-[35px]'
          }>
          { loading ? <LoaderIcon className="animate-spin h-4 w-4" /> : 'Continue In Codeable' }
        </a>
      ) : (
        <button
          onClick={ handleContinue }
          disabled={ loading }
          type="submit"
          className={
            'p-2 rounded-lg w-full text-sm justify-center items-center text-white flex bg-[#457580] hover:opacity-80 min-h-[35px]'
          }>
          { loading ? <LoaderIcon className="animate-spin h-4 w-4" /> : 'Continue In Codeable' }
        </button>
      ) }
    </div>
  );
};

export default CodeableEscalation;
