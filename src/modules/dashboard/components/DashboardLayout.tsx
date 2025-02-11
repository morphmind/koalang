import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Header } from '../../../components';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8">
        {/* Add mt-24 to account for header height plus some extra spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative mt-24">
          {/* Sol Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm p-4">
              <DashboardSidebar />
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-9 space-y-6">
            <DashboardHeader user={user} />
            <div className="bg-white rounded-lg shadow-sm">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};