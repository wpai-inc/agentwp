import React, { createContext, FC, useState } from "react";

interface ContextProps {
  errors: string[];
  clearErrors: () => void;
  addErrors: (error: string[]) => void;
}

export const ErrorPoviderContext = createContext<ContextProps | undefined>(
  undefined,
);

export const ErrorProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState([]);

  const addErrors = (errors: string[]) => {
    setErrors(errors);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorPoviderContext.Provider value={{
      errors,
      clearErrors,
      addErrors,
    }}>
      {children}
    </ErrorPoviderContext.Provider>
  )
};
