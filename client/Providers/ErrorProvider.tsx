import React, { createContext, FC, useContext, useState } from "react";

interface ContextProps {
  errors: string[];
  clearErrors: () => void;
  addErrors: (error: string[]) => void;
}

export const ErrorContext = createContext<ContextProps | undefined>(
  undefined,
);

export function useError() {
  const errors = useContext(ErrorContext);
  if (!errors) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return errors;
}

export const ErrorProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState([]);

  const addErrors = (errors: string[]) => {
    setErrors((prev) => {
      return [
        ...prev,
        ...errors.map((err: any) => ({
          id: err.id ?? crypto.randomUUID(),
          message: err.message ?? err,
        }))
      ];
    });
    setTimeout(() => {
      clearErrors();
    }, 5000);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{
      errors,
      clearErrors,
      addErrors,
    }}>
      {children}
    </ErrorContext.Provider>
  )
};
