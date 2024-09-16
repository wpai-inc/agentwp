import TabContainer from '@/Components/Chat/Tabs/TabContainer';
import SearchInput from './Partials/SearchInput';
import InnerContainer from '@/Components/Chat/Partials/ChatInnerContainer';
import SearchResponse from './SearchResponse';
import { SearchProvider } from '@/Providers/SearchProvider';
import DocIndexStatus from './Partials/DocIndexStatus';
import { DocIndexStatusProvider } from '@/Providers/DocIndexStatusProvider';
import WaitlistTab from '../Tabs/WaitlistTab';

export default function SearchTab() {
  return (
    <TabContainer>
      <WaitlistTab />
    </TabContainer>
    // <TabContainer>
    //     <SearchProvider>
    //       <DocIndexStatusProvider>
    //         <DocIndexStatus />
    //       </DocIndexStatusProvider>
    //       <InnerContainer>
    //         <SearchResponse />
    //       </InnerContainer>
    //       <SearchInput />
    //     </SearchProvider>
    // </TabContainer>
  );
}
