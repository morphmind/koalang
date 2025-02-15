import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from './routes';
import './index.css';
import { ErrorBoundary } from './components';
import { QuizProvider } from './exam/context/QuizContext';
import { AuthProvider } from './modules/auth';
import { WordProvider } from './modules/words/context/WordContext';
import { SettingsProvider } from './modules/settings/context/SettingsContext';
import { DashboardProvider } from './modules/dashboard/context/DashboardContext';
import { NotificationProvider } from './modules/notifications/context/NotificationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <HelmetProvider>
          <AuthProvider>
            <WordProvider>
              <DashboardProvider>
                <NotificationProvider>
                  <SettingsProvider>
                    <QuizProvider>
                      <AppRoutes />
                    </QuizProvider>
                  </SettingsProvider>
                </NotificationProvider>
              </DashboardProvider>
            </WordProvider>
          </AuthProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);