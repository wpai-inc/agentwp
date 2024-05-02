import { ActionType, AgentAction } from '@/Providers/ChatProvider';
import ActionNavigate from '@/Components/Convo/Actions/ActionNavigate';
import ActionMessage from '@/Components/Convo/Actions/ActionMessage';
import { Abilities } from '@wpai/schemas';

type ActionComponentsType = {
  [key in Abilities]?: React.ComponentType<{ action: ActionType }>;
};

const ActionComponents: ActionComponentsType = {
  message: ActionMessage as React.ComponentType<{ action: ActionType }>,
  navigate: ActionNavigate as React.ComponentType<{ action: ActionType }>,
};

export default function AgentResponse({
  agentActions,
}: {
  agentActions: AgentAction[];
}) {
  return (
    <div className="flex gap-4 p-4">
      <div className="w-8 h-8 flex items-center justify-center font-bold bg-blue-500 text-white rounded-full">
        A
      </div>
      <div className="flex-1">
        {agentActions.map((aa) => {
          const ActionComponent =
            ActionComponents[aa.action.ability as Abilities];
          if (!ActionComponent) {
            console.error(
              `No component found for ability: ${aa.action.ability}`,
            );
            return null; // Or render some fallback UI
          }
          return <ActionComponent key={aa.id} action={aa.action} />;
        })}
      </div>
    </div>
  );
}
