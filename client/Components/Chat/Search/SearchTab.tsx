import TabContainer from '@/Components/Chat/Tabs/TabContainer';
import SearchInput from './Partials/SearchInput';
import InnerContainer from '@/Components/Chat/Partials/ChatInnerContainer';
import SearchResponse from './SearchResponse';
import { SearchProvider } from '@/Providers/SearchProvider';

export default function SearchTab() {
  return (
    <TabContainer>
      <SearchProvider>
        <InnerContainer>
          <SearchResponse />
        </InnerContainer>
        <SearchInput />
      </SearchProvider>
    </TabContainer>
  );
}
