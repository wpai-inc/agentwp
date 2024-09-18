import { DataListItem } from '@/Components/ui/dl';
import SummarizeTool from './SummarizeTool';

export default function Tools() {
  return (
    <DataListItem
      label={
        <div>
          <label className="font-bold">Site Summary</label>
          <p className="text-sm">
            AgentWP crawls your site weekly to summarize it for better understanding. Run this now
            instead of waiting.
          </p>
        </div>
      }>
      <SummarizeTool />
    </DataListItem>
  );
}
