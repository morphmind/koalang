import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '../modules/auth/components';
import { AuthLayout } from '../modules/auth/components/AuthLayout';
import { DashboardLayout } from '../modules/dashboard/components/DashboardLayout';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { LearnedWordsPage } from '../modules/dashboard/pages/LearnedWordsPage';
import { AchievementsPage } from '../modules/dashboard/pages/AchievementsPage';
import { ProgressPage } from '../modules/dashboard/pages/ProgressPage';
import { SettingsEmailPage } from '../modules/settings/pages/SettingsEmailPage';
import { SettingsPhonePage } from '../modules/settings/pages/SettingsPhonePage';
import { SettingsPasswordPage } from '../modules/settings/pages/SettingsPasswordPage';
import { SettingsNotificationsPage } from '../modules/settings/pages/SettingsNotificationsPage';
import { SettingsAppearancePage } from '../modules/settings/pages/SettingsAppearancePage';
import { SettingsPrivacyPage } from '../modules/settings/pages/SettingsPrivacyPage';
import { SettingsSecurityPage } from '../modules/settings/pages/SettingsSecurityPage';
import { SettingsLayout } from '../modules/settings/components/SettingsLayout';
import { SettingsProfilePage } from '../modules/settings/pages/SettingsProfilePage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { ForgotPasswordPage } from '../modules/auth/pages/ForgotPasswordPage';
import { NewPasswordPage } from '../modules/auth/pages/NewPasswordPage';
import App from '../App';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="reset-password" element={<PublicRoute><NewPasswordPage /></PublicRoute>} />
      </Route>

      {/* Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="learned-words" element={<LearnedWordsPage />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<SettingsProfilePage />} />
          <Route path="email" element={<SettingsEmailPage />} />
          <Route path="password" element={<SettingsPasswordPage />} />
          <Route path="phone" element={<SettingsPhonePage />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
          <Route path="privacy" element={<SettingsPrivacyPage />} />
          <Route path="appearance" element={<SettingsAppearancePage />} />
          <Route path="security" element={<SettingsSecurityPage />} />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};