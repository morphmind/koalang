import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Eye, 
  Palette, 
  Shield, 
  Key,
  Smartphone,
  Mail,
  Settings as SettingsIcon
} from 'lucide-react';

export const SettingsSidebar: React.FC = () => {
  const menuItems = [
    {
      icon: User,
      label: 'Profil Bilgileri',
      href: '/dashboard/settings/profile',
      description: 'Kişisel bilgilerinizi yönetin'
    },
    {
      icon: Mail,
      label: 'Email Ayarları',
      href: '/dashboard/settings/email',
      description: 'Email adresinizi değiştirin'
    },
    {
      icon: Key,
      label: 'Şifre',
      href: '/dashboard/settings/password',
      description: 'Şifrenizi değiştirin'
    },
    {
      icon: Smartphone,
      label: 'Telefon',
      href: '/dashboard/settings/phone',
      description: 'Telefon numaranızı yönetin'
    },
    {
      icon: Bell,
      label: 'Bildirimler',
      href: '/dashboard/settings/notifications',
      description: 'Bildirim tercihlerinizi yönetin'
    },
    {
      icon: Eye,
      label: 'Gizlilik',
      href: '/dashboard/settings/privacy',
      description: 'Gizlilik ayarlarınızı yönetin'
    },
    {
      icon: Palette,
      label: 'Görünüm',
      href: '/dashboard/settings/appearance',
      description: 'Tema ve görünüm ayarları'
    },
    {
      icon: Shield,
      label: 'Güvenlik',
      href: '/dashboard/settings/security',
      description: 'Hesap güvenlik ayarları'
    }
  ];

  return (
    <aside className="lg:col-span-3 space-y-8">
      {/* Ayarlar Başlığı */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-bs-50 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-bs-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-bs-navy">Ayarlar</h2>
            <p className="text-sm text-bs-navygri">
              Hesap ayarlarınızı yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Navigasyon */}
      <nav className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
        <div className="divide-y divide-bs-100">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-4 p-4 hover:bg-bs-50 transition-colors relative
                ${isActive ? 'bg-bs-50 text-bs-primary' : 'text-bs-navy'}
              `}
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center
                           shadow-sm border border-bs-100">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-bs-navygri">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};