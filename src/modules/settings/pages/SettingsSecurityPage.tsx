
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { Shield, AlertCircle, CheckCircle2, Smartphone, Key, History, LogOut } from 'lucide-react';

export const SettingsSecurityPage: React.FC = () => {
  const { isLoading, error } = useSettings();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Son aktiviteler (örnek veri)
  const recentActivities = [
    {
      id: 1,
      type: 'login',
      device: 'Chrome / Windows 10',
      location: 'İstanbul, Türkiye',
      ip: '192.168.1.1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 dakika önce
    },
    {
      id: 2,
      type: 'password_change',
      device: 'Chrome / Windows 10',
      location: 'İstanbul, Türkiye',
      ip: '192.168.1.1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 gün önce
    }
  ];

  // Aktif oturumlar (örnek veri)
  const activeSessions = [
    {
      id: 1,
      device: 'Chrome / Windows 10',
      location: 'İstanbul, Türkiye',
      ip: '192.168.1.1',
      lastActive: new Date(Date.now() - 1000 * 60 * 5) // 5 dakika önce
    },
    {
      id: 2,
      device: 'Safari / iPhone',
      location: 'Ankara, Türkiye', 
      ip: '192.168.1.2',
      lastActive: new Date(Date.now() - 1000 * 60 * 60) // 1 saat önce
    }
  ];

  const handleEndSession = async (sessionId: number) => {
    try {
      // TODO: Implement session termination
      setSuccessMessage('Oturum başarıyla sonlandırıldı.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Oturum sonlandırılırken hata:', err);
    }
  };

  const handleEndAllSessions = async () => {
    try {
      // TODO: Implement all sessions termination
      setSuccessMessage('Tüm oturumlar başarıyla sonlandırıldı.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Oturumlar sonlandırılırken hata:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-bs-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Güvenlik Ayarları
            </h2>
            <p className="text-sm text-bs-navygri">
              Hesap güvenlik ayarlarınızı yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && <ErrorMessage message={error} />}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{successMessage}</div>
          </div>
        )}

        {/* Güvenlik Durumu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-bs-100 bg-gradient-to-br from-bs-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                <Key className="w-5 h-5 text-bs-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-bs-navy">Şifre Durumu</div>
                <div className="text-xs text-bs-navygri">Son değiştirilme: 30 gün önce</div>
              </div>
            </div>
            <a 
              href="/dashboard/settings/password"
              className="text-sm text-bs-primary hover:text-bs-800"
            >
              Şifreyi Değiştir →
            </a>
          </div>

          <div className="p-4 rounded-xl border border-bs-100 bg-gradient-to-br from-bs-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-bs-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-bs-navy">İki Faktörlü Doğrulama</div>
                <div className="text-xs text-bs-navygri">Aktif Değil</div>
              </div>
            </div>
            <button className="text-sm text-bs-primary hover:text-bs-800">
              Aktifleştir →
            </button>
          </div>

          <div className="p-4 rounded-xl border border-bs-100 bg-gradient-to-br from-bs-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                <History className="w-5 h-5 text-bs-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-bs-navy">Son Giriş</div>
                <div className="text-xs text-bs-navygri">5 dakika önce</div>
              </div>
            </div>
            <button className="text-sm text-bs-primary hover:text-bs-800">
              Detayları Gör →
            </button>
          </div>
        </div>

        {/* Aktif Oturumlar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-bs-navy">Aktif Oturumlar</h3>
            <button
              onClick={handleEndAllSessions}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Tüm Oturumları Sonlandır
            </button>
          </div>

          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div 
                key={session.id}
                className="p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                         hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-bs-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-bs-navy">{session.device}</div>
                      <div className="text-sm text-bs-navygri">
                        {session.location} • IP: {session.ip}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEndSession(session.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 
                             hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-bs-navy mb-4">
            Son Güvenlik Aktiviteleri
          </h3>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id}
                className="p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                         hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                    {activity.type === 'login' ? (
                      <LogOut className="w-5 h-5 text-bs-primary" />
                    ) : (
                      <Key className="w-5 h-5 text-bs-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-bs-navy">
                      {activity.type === 'login' ? 'Başarılı Giriş' : 'Şifre Değişikliği'}
                    </div>
                    <div className="text-sm text-bs-navygri">
                      {activity.device} • {activity.location} • IP: {activity.ip}
                    </div>
                    <div className="text-xs text-bs-navygri mt-1">
                      {activity.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bilgi Notu */}
        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Önemli Güvenlik Tavsiyeleri</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Şifrenizi düzenli olarak değiştirin.</li>
              <li>İki faktörlü doğrulamayı aktifleştirerek hesabınızı koruyun.</li>
              <li>Tanımadığınız cihazlardan giriş yapıldığında bildirim alın.</li>
              <li>Şüpheli bir aktivite fark ederseniz hemen şifrenizi değiştirin.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
