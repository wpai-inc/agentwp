import TabContainer from '@/Components/Chat/Tabs/TabContainer';
import SearchInput from './Partials/SearchInput';
import InnerContainer from '@/Components/Chat/Partials/ChatInnerContainer';
import SearchResponse from './SearchResponse';

export default function SearchTab() {
  return (
    <TabContainer>
      <InnerContainer>
        <SearchResponse />
      </InnerContainer>
      <SearchInput />
    </TabContainer>
  );
}
