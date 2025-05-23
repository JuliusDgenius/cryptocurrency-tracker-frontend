import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client'; 
import App from './App.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { CustomThemeProvider } from './providers/ThemeProvider.tsx';
import { ErrorProvider } from './providers/ErrorProvider.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <CustomThemeProvider>
      <ErrorProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorProvider>
    </CustomThemeProvider>
  </QueryClientProvider>,
)
