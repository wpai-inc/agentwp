import MD from '@/Components/MD';
import type { MessageAgentAction } from '@/Components/Convo/Actions/ActionMessage';

export default function ActionSimpleMessage({ action }: MessageAgentAction) {
    return (
        <MD>{action?.text ?? 'something went wrong'}</MD>
    );
}