import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { PrivateRoute } from './components/PrivateRoute';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import { Navbar } from './components/NavBar';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';
import { PasswordResetRequestPage } from './features/auth/pages/RequestPasswordResetPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import HomePage from './features/home/HomePage';
import { ErrorNotification } from './components/NotificationAlert';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar /> 
      <main className='container mx-auto p-4'>
        <Routes>
          {/* Home Page */}
          <Route index path='/' element={<HomePage />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

          {/* Password Management */}
          <Route path="/request-reset" element={<PasswordResetRequestPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Not Found Route */}
          <Route path='*' element={<div>Not Found</div>} />
          <Route element={<ErrorNotification />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;