import getSelectedGutenbergBlock from '@/Page/Admin/Chat/SelectedFields/getSelectedGutenbergBlock';
import getSelectedInputField from '@/Page/Admin/Chat/SelectedFields/getSelectedInputField';
import getSelectedPostTitle from '@/Page/Admin/Chat/SelectedFields/getSelectedPostTitle';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

declare const wp: any;

type selectedInputType = {
  inputPath: string;
  inputLabel: string;
  inputName: string | null;
  inputId: string | null;
  inputValue: string | null;
};

type streamableFieldType = {
  type: string;
  data: selectedInputType | null;
};

type ContextProps = {
  selectedInput: streamableFieldType | null;
  setSelectedInput: React.Dispatch<React.SetStateAction<streamableFieldType | null>>;
};
export const InputSelectContext = createContext<ContextProps | undefined>(undefined);

export const useInputSelect = () => {
  const inputSelect = useContext(InputSelectContext);
  if (inputSelect === undefined) {
    throw new Error('useInputSelect must be used within InputSelectProvider');
  }
  return inputSelect;
};

export const InputSelectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedInput, setSelectedInput] = useState<streamableFieldType | null>(null);

  useEffect(() => {
    getSelectedInputField(setSelectedInput);
    getSelectedGutenbergBlock(setSelectedInput);
    getSelectedPostTitle(setSelectedInput);
  }, []);

  return (
    <InputSelectContext.Provider
      value={{
        selectedInput,
        setSelectedInput,
      }}>
      {children}
    </InputSelectContext.Provider>
  );
};
