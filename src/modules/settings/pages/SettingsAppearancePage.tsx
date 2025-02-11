import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { Palette, Sun, Moon, AlertCircle, CheckCircle2, Type, Zap, Eye } from 'lucide-react';
import { Switch } from '../../../components/ui/switch';

export const SettingsAppearancePage: React.FC = () => {
  const { profile, updateThemePreferences, isLoading, error } = useSettings();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleChange = async (key: string, value: any) => {
    if (!profile?.theme_preferences) return;

    try {
      const updatedPreferences = {
        ...profile.theme_preferences,
        [key]: value
      };

      await updateThemePreferences(updatedPreferences);
      setSuccessMessage('Görünüm ayarları başarıyla güncellendi.');

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Görünüm ayarları güncellenirken hata:', err);
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
            <Palette className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Görünüm Ayarları
            </h2>
            <p className="text-sm text-bs-navygri">
              Tema ve görünüm tercihlerinizi yönetin
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

        {/* Tema Seçimi */}
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                       hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                <Sun className="w-5 h-5 text-bs-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-bs-navy mb-1">Tema</div>
                <div className="text-sm text-bs-navygri">Tercih ettiğiniz temayı seçin</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleChange('theme', 'light')}
                className={`p-4 rounded-lg border text-sm font-medium transition-all
                         ${profile?.theme_preferences?.theme === 'light'
                           ? 'bg-bs-primary text-white border-bs-primary'
                           : 'bg-white text-bs-navy border-bs-100 hover:border-bs-primary hover:bg-bs-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5" />
                  <span>Aydınlık Tema</span>
                </div>
              </button>
              <button
                onClick={() => handleChange('theme', 'dark')}
                className={`p-4 rounded-lg border text-sm font-medium transition-all
                         ${profile?.theme_preferences?.theme === 'dark'
                           ? 'bg-bs-primary text-white border-bs-primary'
                           : 'bg-white text-bs-navy border-bs-100 hover:border-bs-primary hover:bg-bs-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5" />
                  <span>Karanlık Tema</span>
                </div>
              </button>
            </div>
          </div>

          {/* Yazı Boyutu */}
          <div className="p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                       hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                <Type className="w-5 h-5 text-bs-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-bs-navy mb-1">Yazı Boyutu</div>
                <div className="text-sm text-bs-navygri">Tercih ettiğiniz yazı boyutunu seçin</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => handleChange('font_size', size)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all
                           ${profile?.theme_preferences?.font_size === size
                             ? 'bg-bs-primary text-white border-bs-primary'
                             : 'bg-white text-bs-navy border-bs-100 hover:border-bs-primary hover:bg-bs-50'}`}
                >
                  {size === 'small' && 'Küçük'}
                  {size === 'medium' && 'Orta'}
                  {size === 'large' && 'Büyük'}
                </button>
              ))}
            </div>
          </div>

          {/* Erişilebilirlik */}
          <div className="p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                       hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-bs-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-bs-navy mb-1">Erişilebilirlik</div>
                <div className="text-sm text-bs-navygri">Erişilebilirlik tercihlerinizi yönetin</div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Yüksek Kontrast */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-bs-100
                           hover:border-bs-primary transition-all">
                <div>
                  <div className="font-medium text-bs-navy">Yüksek Kontrast</div>
                  <div className="text-sm text-bs-navygri">Daha iyi okunabilirlik için kontrastı artırın</div>
                </div>
                <Switch
                  checked={profile?.theme_preferences?.high_contrast ?? false}
                  onChange={() => handleChange('high_contrast', !profile?.theme_preferences?.high_contrast)}
                  size="md"
                />
              </div>

              {/* Animasyon Azaltma */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-bs-100
                           hover:border-bs-primary transition-all">
                <div>
                  <div className="font-medium text-bs-navy">Animasyonları Azalt</div>
                  <div className="text-sm text-bs-navygri">Hareket hassasiyeti için animasyonları azaltın</div>
                </div>
                <Switch
                  checked={profile?.theme_preferences?.reduce_animations ?? false}
                  onChange={() => handleChange('reduce_animations', !profile?.theme_preferences?.reduce_animations)}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bilgi Notu */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Önemli Not</p>
            <p>Görünüm ayarlarınızı değiştirdiğinizde:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Değişiklikler anında uygulanır.</li>
              <li>Tercihleriniz tarayıcınızda kaydedilir.</li>
              <li>Farklı cihazlarda aynı ayarları kullanmak için giriş yapmanız gerekir.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};