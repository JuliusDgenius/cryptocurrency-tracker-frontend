import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { PrivateRoute } from './components/PrivateRoute';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import { Navbar } from './components/NavBar';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';
import { PasswordResetRequestPage } from './features/auth/pages/RequestPasswordResetPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar /> 
      <main className='container mx-auto p-4'>
        <Routes>
          {/* Home Page */}
          <Route index path='/' element={<div>Home Page</div>} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

          {/* Password Management */}
          // Add these routes
          <Route path="/password-reset-request" element={<PasswordResetRequestPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Not Found Route */}
          <Route path='*' element={<div>Not Found</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;