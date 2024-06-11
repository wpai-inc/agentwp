import { MessageActionEscalation } from '@wpai/schemas';
import CodeableLogo from '@/assets/services/codeable.png';

type Props = {
  escalation: MessageActionEscalation;
};

const CodeableEscalation = ( { escalation }: Props ) => {
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
          <a href="#" className="text-blue-500 hover:underline">
            View Full Scope.
          </a>
        </p>
      </div>
      <a
        href="#"
        className={
          'p-2 rounded-lg text-sm justify-center items-center text-white flex bg-[#457580] hover:opacity-80'
        }>
        Continue In Codeable
      </a>
    </div>
  );
};

export default CodeableEscalation;
