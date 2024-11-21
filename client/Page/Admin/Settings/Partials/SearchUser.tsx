import { Spinner } from '@/Components/Spinner';
import IconSearch from '@material-design-icons/svg/outlined/search.svg?react';
import { useTranslation } from 'react-i18next';

export default function SearchUser( {
  searchUsers,
  searching,
}: {
  searchUsers: ( value: string ) => void;
  searching: boolean;
} ) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center bg-white rounded px-4 py-2 border border-gray-300">
      <IconSearch className="w-6 h-6 text-gray-300" />
      <input
        type="text"
        onInput={ ev => searchUsers( ( ev.target as HTMLInputElement ).value ) }
        className={ 'w-full ml-2 shadow-none bg-transparent' }
        placeholder={ t( 'Search for a user...' ) }
      />
      <Spinner show={ searching } />
    </div>
  );
}
