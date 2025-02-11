import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Switch } from '../../../components/ui/switch';

export const SettingsNotificationsPage: React.FC = () => {
  const { profile, updateNotificationPreferences, isLoading, error } = useSettings();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const notificationSettings = [
    {
      id: 'email_notifications',
      label: 'Email Bildirimleri',
      description: 'Önemli güncellemeler ve bilgilendirmeler için email bildirimleri alın'
    },
    {
      id: 'push_notifications',
      label: 'Anlık Bildirimler',
      description: 'Tarayıcı üzerinden anlık bildirimler alın'
    },
    {
      id: 'quiz_reminders',
      label: 'Sınav Hatırlatıcıları',
      description: 'Sınav zamanı geldiğinde hatırlatma bildirimleri alın'
    },
    {
      id: 'learning_reminders',
      label: 'Öğrenme Hatırlatıcıları',
      description: 'Günlük öğrenme hedefleriniz için hatırlatmalar alın'
    },
    {
      id: 'achievement_notifications',
      label: 'Başarı Bildirimleri',
      description: 'Yeni başarılar kazandığınızda bildirim alın'
    },
    {
      id: 'weekly_summary',
      label: 'Haftalık Özet',
      description: 'Her hafta ilerlemeniz hakkında detaylı bir rapor alın'
    }
  ];

  const handleToggle = async (settingId: string) => {
    if (!profile?.notification_preferences) return;

    try {
      const updatedPreferences = {
        ...profile.notification_preferences,
        [settingId]: !profile.notification_preferences[settingId as keyof typeof profile.notification_preferences]
      };

      await updateNotificationPreferences(updatedPreferences);
      setSuccessMessage('Bildirim tercihleri başarıyla güncellendi.');

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Bildirim tercihleri güncellenirken hata:', err);
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
            <Bell className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Bildirim Ayarları
            </h2>
            <p className="text-sm text-bs-navygri">
              Bildirim tercihlerinizi yönetin
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

        {/* Bildirim Tercihleri */}
        <div className="space-y-6">
          {notificationSettings.map((setting) => (
            <div 
              key={setting.id}
              className="flex items-start justify-between gap-4 p-4 rounded-xl border border-bs-100
                       hover:border-bs-primary hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex-1">
                <div className="font-medium text-bs-navy mb-1">{setting.label}</div>
                <div className="text-sm text-bs-navygri">{setting.description}</div>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={profile?.notification_preferences?.[setting.id as keyof typeof profile.notification_preferences] ?? false}
                  onChange={() => handleToggle(setting.id)}
                  size="md"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bilgi Notu */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Önemli Not</p>
            <p>Bildirim tercihlerinizi değiştirdiğinizde:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Değişiklikler anında uygulanır.</li>
              <li>Email bildirimleri için email adresinizin doğrulanmış olması gerekir.</li>
              <li>Anlık bildirimler için tarayıcı izinlerini kabul etmeniz gerekebilir.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};