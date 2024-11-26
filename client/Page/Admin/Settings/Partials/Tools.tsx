import { DataListItem } from '@/Components/ui/dl';
import SummarizeTool from './SummarizeTool';
import { useTranslation } from 'react-i18next';

export default function Tools() {
  const { t } = useTranslation();
  return (
    <DataListItem
      label={
        <div>
          <label className="font-bold">{ t( 'Site Summary' ) }</label>
          <p className="text-sm">
            { t(
              'AgentWP crawls your site weekly to summarize it for better understanding. Run this now instead of waiting.',
            ) }
          </p>
        </div>
      }>
      <SummarizeTool />
    </DataListItem>
  );
}
