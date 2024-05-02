import ActionContainer from '../ActionContainer';
import { RefreshCw } from 'lucide-react';

export default function ActionIncomplete() {
  return (
    <ActionContainer pending={false}>
      <div className="flex justify-between">
        <p>Something went wrong.</p>
        <button>
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </ActionContainer>
  );
}
