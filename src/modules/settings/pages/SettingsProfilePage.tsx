import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { User, Mail, Phone, Upload, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export const SettingsProfilePage: React.FC = () => {
  const { 
    profile,
    updateProfile,
    isLoading,
    error
  } = useSettings();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Telefon numarası için state
  const [phoneValue, setPhoneValue] = React.useState(profile?.phone || '');

  const [formData, setFormData] = React.useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: profile?.email || '',
    avatar: profile?.avatar_url || ''
  });

  // Keep track of initial values to detect changes
  const [initialData, setInitialData] = React.useState(formData);

  // Load initial data when profile changes
  React.useEffect(() => {
    if (profile) {
      const newData = {
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatar: profile.avatar_url || ''
      };
      setFormData(newData);
      setInitialData(newData);
    }
  }, [profile]);

  // Kullanıcının ülkesini tespit et
  const [userCountry, setUserCountry] = React.useState('TR');
  
  React.useEffect(() => {
    // Kullanıcının IP'sine göre ülke tespiti
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setUserCountry(data.country_code);
      })
      .catch(() => {
        // Hata durumunda varsayılan olarak TR
        setUserCountry('TR');
      });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipi ve boyut kontrolü
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setUploadError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Dosya adını unique yap
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Dosyayı yükle
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Profili güncelle
      await updateProfile({
        avatar_url: publicUrl
      });

      // Form state'ini güncelle
      setFormData(prev => ({ ...prev, avatar: publicUrl }));

    } catch (err) {
      console.error('Profil fotoğrafı yüklenirken hata:', err);
      setUploadError('Profil fotoğrafı yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);

      // Eski fotoğrafı sil
      if (formData.avatar) {
        const oldFileName = formData.avatar.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('profiles')
            .remove([`avatars/${oldFileName}`]);
        }
      }

      // Profili güncelle
      await updateProfile({
        avatar_url: null
      });

      // Form state'ini güncelle
      setFormData(prev => ({ ...prev, avatar: '' }));

    } catch (err) {
      console.error('Profil fotoğrafı silinirken hata:', err);
      setUploadError('Profil fotoğrafı silinirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: any = {};
    
    if (formData.firstName !== initialData.firstName) {
      updates.first_name = formData.firstName;
    }
    
    if (formData.lastName !== initialData.lastName) {
      updates.last_name = formData.lastName;
    }

    if (phoneValue !== profile?.phone) {
      updates.phone = phoneValue;
    }

    if (formData.avatar !== initialData.avatar) {
      updates.avatar_url = formData.avatar;
    }

    if (Object.keys(updates).length > 0) {
      await updateProfile(updates);
      setInitialData(formData);
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
      <div className="p-6 border-b border-bs-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
            <User className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Profil Bilgileri
            </h2>
            <p className="text-sm text-bs-navygri">
              Kişisel bilgilerinizi güncelleyin
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && <ErrorMessage message={error} />}
        {uploadError && <ErrorMessage message={uploadError} />}

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-bs-50 flex items-center justify-center relative group">
            {formData.avatar ? (
              <>
                <img 
                  src={formData.avatar} 
                  alt="Profil fotoğrafı"
                  className="w-full h-full rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                  className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100
                           flex items-center justify-center transition-opacity"
                  title="Fotoğrafı kaldır"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </>
            ) : (
              <User className="w-8 h-8 text-bs-primary" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Profil Fotoğrafı
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 text-sm font-medium text-bs-primary border border-bs-primary 
                         rounded-lg hover:bg-bs-50 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Fotoğraf Yükle
                  </>
                )}
              </button>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600
                           rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Kaldır
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-bs-navygri">
              PNG, JPG veya GIF • Maks. 5MB
            </p>
          </div>
        </div>

        {/* İsim ve Soyisim */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              İsim
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                       focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
              placeholder="İsminizi girin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Soyisim
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                       focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
              placeholder="Soyisminizi girin"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-bs-navy mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-bs-navygri" />
            </div>
            <input
              type="email"
              value={formData.email}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-bs-100 bg-bs-50 text-bs-navy"
              placeholder="Email adresinizi girin"
              disabled
            />
          </div>
          <p className="mt-2 text-xs text-bs-navygri">
            Email adresinizi değiştirmek için lütfen email ayarları sayfasını ziyaret edin.
          </p>
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium text-bs-navy mb-2">
            Telefon
          </label>
          <div className="relative">
            <PhoneInput
              country="tr"
              value={phoneValue}
              onChange={setPhoneValue}
              enableSearch
              searchPlaceholder="Ülke ara..."
              inputClass="w-full px-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                         focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
              buttonClass="border-bs-100 rounded-lg bg-white hover:bg-bs-50 
                          hover:border-bs-primary transition-all"
              dropdownClass="rounded-xl border-bs-100 shadow-lg mt-2"
              searchClass="rounded-lg border-bs-100 mb-2"
              containerClass="phone-input-container"
              specialLabel=""
              localization={{
                tr: 'Türkiye',
                us: 'Amerika Birleşik Devletleri',
                gb: 'Birleşik Krallık',
                de: 'Almanya',
                fr: 'Fransa',
                it: 'İtalya',
                es: 'İspanya',
                nl: 'Hollanda'
              }}
              preferredCountries={['tr', 'us', 'gb', 'de']}
            />
          </div>
          <p className="mt-2 text-xs text-bs-navygri">
            Ülke kodunu değiştirmek için bayrak simgesine tıklayabilirsiniz
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-bs-100">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-bs-primary text-white rounded-xl font-medium
                     hover:bg-bs-800 transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                Kaydediliyor...
              </>
            ) : (
              'Değişiklikleri Kaydet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};