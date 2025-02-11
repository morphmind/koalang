import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { User, Mail, Key, Smartphone, Bell, Eye, Palette, Shield } from 'lucide-react';
import { SettingsProvider } from '../context/SettingsContext';

export const SettingsLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const [activeMainTab, setActiveMainTab] = useState<'profile' | 'preferences'>(
    ['profile', 'email', 'password', 'phone'].includes(currentPath || 'profile') ? 'profile' : 'preferences'
  );

  const mainTabs = [
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      defaultPath: '/dashboard/settings/profile',
      subTabs: [
        { id: 'profile', label: 'Profil Bilgileri', icon: User, path: '/dashboard/settings/profile' },
        { id: 'email', label: 'Email', icon: Mail, path: '/dashboard/settings/email' },
        { id: 'password', label: 'Şifre', icon: Key, path: '/dashboard/settings/password' },
        { id: 'phone', label: 'Telefon', icon: Smartphone, path: '/dashboard/settings/phone' }
      ]
    },
    {
      id: 'preferences',
      label: 'Tercihler',
      icon: Bell,
      defaultPath: '/dashboard/settings/notifications',
      subTabs: [
        { id: 'notifications', label: 'Bildirimler', icon: Bell, path: '/dashboard/settings/notifications' },
        { id: 'privacy', label: 'Gizlilik', icon: Eye, path: '/dashboard/settings/privacy' },
        { id: 'appearance', label: 'Görünüm', icon: Palette, path: '/dashboard/settings/appearance' },
        { id: 'security', label: 'Güvenlik', icon: Shield, path: '/dashboard/settings/security' }
      ]
    }
  ];

  const navigate = useNavigate();

  const handleMainTabClick = (tabId: 'profile' | 'preferences', defaultPath: string) => {
    setActiveMainTab(tabId); 
    navigate(defaultPath, { replace: true });
  };
  // Aktif ana sekmeyi belirle
  React.useEffect(() => {
    const currentTab = currentPath || 'profile';
    const isProfileTab = ['profile', 'email', 'password', 'phone'].includes(currentTab);
    setActiveMainTab(isProfileTab ? 'profile' : 'preferences');
  }, [currentPath]);

  return (
    <SettingsProvider>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ana Sekmeler */}
        <div className="bg-white rounded-2xl shadow-lg border border-bs-100 mb-6">
          <div className="flex flex-col items-center py-6">
            {/* Ana Sekmeler */}
            <div className="flex gap-4 bg-bs-50 p-1 rounded-xl">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleMainTabClick(tab.id as 'profile' | 'preferences', tab.defaultPath)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium 
                           transition-all ${activeMainTab === tab.id
                             ? 'bg-white text-bs-primary shadow-lg' 
                             : 'text-bs-navygri hover:text-bs-primary'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Alt Sekmeler */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {mainTabs.find(t => t.id === activeMainTab)?.subTabs.map((subTab) => {
                const isActive = currentPath === subTab.id;
                return (
                  <Link
                    key={subTab.id}
                    to={subTab.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                             transition-all ${isActive 
                               ? 'bg-bs-primary text-white shadow-lg shadow-bs-primary/20' 
                               : 'text-bs-navygri hover:bg-bs-50'}`}
                  >
                    <subTab.icon className="w-4 h-4" />
                    {subTab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="bg-white rounded-2xl shadow-lg border border-bs-100">
          <Outlet />
        </div>
      </div>
    </SettingsProvider>
  );
};