import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { Eye, AlertCircle, CheckCircle2, Users, BookOpen, Award, Activity } from 'lucide-react';

export const SettingsPrivacyPage: React.FC = () => {
  const { profile, updatePrivacySettings, isLoading, error } = useSettings();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const privacySettings = [
    {
      id: 'profile_visibility',
      icon: Users,
      label: 'Profil Görünürlüğü',
      description: 'Profilinizi kimlerin görebileceğini seçin',
      options: [
        { value: 'public', label: 'Herkese Açık' },
        { value: 'friends', label: 'Sadece Arkadaşlar' },
        { value: 'private', label: 'Gizli' }
      ]
    },
    {
      id: 'learning_status_visibility',
      icon: BookOpen,
      label: 'Öğrenme Durumu',
      description: 'Öğrenme ilerlemenizi kimlerin görebileceğini seçin',
      options: [
        { value: 'public', label: 'Herkese Açık' },
        { value: 'friends', label: 'Sadece Arkadaşlar' },
        { value: 'private', label: 'Gizli' }
      ]
    },
    {
      id: 'achievements_visibility',
      icon: Award,
      label: 'Başarılar',
      description: 'Başarılarınızı kimlerin görebileceğini seçin',
      options: [
        { value: 'public', label: 'Herkese Açık' },
        { value: 'friends', label: 'Sadece Arkadaşlar' },
        { value: 'private', label: 'Gizli' }
      ]
    },
    {
      id: 'activity_visibility',
      icon: Activity,
      label: 'Aktivite Geçmişi',
      description: 'Aktivitelerinizi kimlerin görebileceğini seçin',
      options: [
        { value: 'public', label: 'Herkese Açık' },
        { value: 'friends', label: 'Sadece Arkadaşlar' },
        { value: 'private', label: 'Gizli' }
      ]
    }
  ];

  const handleChange = async (settingId: string, value: string) => {
    if (!profile?.privacy_settings) return;

    try {
      const updatedSettings = {
        ...profile.privacy_settings,
        [settingId]: value
      };

      await updatePrivacySettings(updatedSettings);
      setSuccessMessage('Gizlilik ayarları başarıyla güncellendi.');

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Gizlilik ayarları güncellenirken hata:', err);
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
            <Eye className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Gizlilik Ayarları
            </h2>
            <p className="text-sm text-bs-navygri">
              Gizlilik tercihlerinizi yönetin
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

        {/* Gizlilik Ayarları */}
        <div className="space-y-6">
          {privacySettings.map((setting) => {
            const Icon = setting.icon;
            const currentValue = profile?.privacy_settings?.[setting.id as keyof typeof profile.privacy_settings];
            
            return (
              <div 
                key={setting.id}
                className="p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                         hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-bs-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-bs-navy mb-1">{setting.label}</div>
                    <div className="text-sm text-bs-navygri">{setting.description}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {setting.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange(setting.id, option.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all
                               ${currentValue === option.value
                                 ? 'bg-bs-primary text-white border-bs-primary'
                                 : 'bg-white text-bs-navy border-bs-100 hover:border-bs-primary hover:bg-bs-50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bilgi Notu */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Önemli Not</p>
            <p>Gizlilik ayarlarınızı değiştirdiğinizde:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Değişiklikler anında uygulanır.</li>
              <li>Herkese açık seçeneği, tüm kullanıcıların ilgili içeriği görebileceği anlamına gelir.</li>
              <li>Sadece arkadaşlar seçeneği, yalnızca arkadaş listenizde bulunan kullanıcıların içeriği görebileceği anlamına gelir.</li>
              <li>Gizli seçeneği, içeriğin yalnızca sizin tarafınızdan görülebileceği anlamına gelir.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};