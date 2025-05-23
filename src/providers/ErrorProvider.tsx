import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type ErrorContextType = {
  error: string | null;
  showError: (message: string) => void;
};

const ErrorContext = createContext<ErrorContextType>({} as ErrorContextType);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    // Auto-hide after 6 seconds
    setTimeout(() => setError(null), 6000);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, showError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);