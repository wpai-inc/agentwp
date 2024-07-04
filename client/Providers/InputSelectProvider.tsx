import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Notifications } from '@/Components/Notifications';

type InputSelectContextType = {
  selectedInput: string;
  setSelectedInput: ( input: string ) => string | null;
};

export const InputSelectContext = createContext< InputSelectContextType | undefined >( undefined );

export const useInputSelect = () => {
  const inputSelect = useContext( InputSelectContext );
  if ( inputSelect === undefined ) {
    throw new Error( 'useNotifications must be used within a NotificationsContext' );
  }
  return inputSelect;
};

export const InputSelectProvider = ( { children }: { children: ReactNode } ) => {
  const [ selectedInput, setSelectedInput ] = useState< string | null >( null );

  useEffect( () => {
    const getAllInputElements = () => {
      const inputElements = document.querySelectorAll( 'input[type="text"], textarea' );
    inputElements.forEach((inputElement) => {
        const icon = document.createElement('div');
        icon.style.width = '20px';
        icon.style.height = '2px';
        icon.style.backgroundColor = 'blue';
        icon.addEventListener('click', () => {
            // Handle icon click event here
            // You can access the input element using inputElement variable
        });
        inputElement.parentNode?.insertBefore(icon, inputElement);
    });
    };

    getAllInputElements();
  }, [] );

  return (
    <InputSelectContext.Provider
      value={ {
        selectedInput,
        setSelectedInput,
      } }>
      { children }
    </InputSelectContext.Provider>
  );
};
