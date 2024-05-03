import type { AgentAction } from '@/Providers/UserRequestsProvider';
import ActionNavigate from '@/Components/Convo/Actions/ActionNavigate';
import ActionMessage from '@/Components/Convo/Actions/ActionMessage';
import { Abilities } from '@wpai/schemas';
import ActionIncomplete from './Actions/ActionIncomplete';
import ActionPending from './Actions/ActionPending';
import { useUserRequests } from '@/Providers/UserRequestsProvider';

type ActionComponentsType = {
  [key in Abilities]?: React.ComponentType<AgentAction>;
};

const ActionComponents: ActionComponentsType = {
  message: ActionMessage,
  navigate: ActionNavigate,
};

export default function AgentResponse({
  agentActions,
}: {
  agentActions?: AgentAction[];
}) {
  const { currentAction } = useUserRequests();
  return (
    <div className="flex gap-4 p-4">
      <div className="w-8 h-8 flex items-center justify-center font-bold bg-blue-500 text-white rounded-full">
        A
      </div>
      {agentActions === undefined ? (
        <ActionPending />
      ) : agentActions.length > 0 ? (
        <div className="flex-1">
          {agentActions.map((aa) => {
            if (!aa.action) {
              return <ActionIncomplete key={aa.id} />;
            } else {
              const ActionComponent =
                ActionComponents[aa.action.ability as Abilities];
              if (!ActionComponent) {
                console.error(
                  `No component found for ability: ${aa.action.ability}`,
                );
                return null; // Or render some fallback UI
              }
              return <ActionComponent key={aa.id} {...aa} />;
            }
          })}

          {!currentAction?.final && <p>Waiting on next action...</p>}
        </div>
      ) : (
        <div>No actions</div>
      )}
    </div>
  );
}
