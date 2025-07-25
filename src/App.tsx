import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { PrivateRoute } from './components/PrivateRoute';
import DashboardPageHome from './features/dashboard/pages/DashboardHome';
import { Navbar } from './components/NavBar';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';
import { PasswordResetRequestPage } from './features/auth/pages/RequestPasswordResetPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import HomePage from './features/home/HomePage';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorBoundary } from './components/ErrorBoundary';
import PortfolioDashboard from './features/dashboard/pages/PortfolioDashboard';
import DemoDashboard from './features/dashboard/pages/DemoDashboard';
import SettingsPage from './features/settings/pages/SettingsPage';
import AccountsPage from './features/accounts/AccountsPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary /> {/* Catch React component errors */}
        {/* Global components */}
        <Navbar /> 
        <ErrorNotification /> {/* Catch API/network errors */}
        <main className='container mx-auto p-4'>
          <Routes>
            {/* Public Routes */}
            <Route index path='/' element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/request-reset" element={<PasswordResetRequestPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />

            <Route path="/demo" element={<DemoDashboard />} /> 

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<DashboardPageHome />} />
              <Route path='/portfolio/:portfolioId' element={<PortfolioDashboard />} />
              <Route path='settings' element={<SettingsPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>
            {/* Not Found Route */}
            <Route path='*' element={<div>Not Found</div>} />
          </Routes>
        </main>
    </BrowserRouter>
  );
}

export default App;