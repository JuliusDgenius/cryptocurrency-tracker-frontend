type ErrorHandler = (message: string) => void;
let globalShowError: ErrorHandler | null = null;

export const setGlobalShowError = (handler: ErrorHandler | null) => {
  globalShowError = handler;
};

export const getGlobalShowError = (): ErrorHandler => {
  if (!globalShowError) {
    return () => console.error('Error handler not initialized');
  }
  return globalShowError;
};