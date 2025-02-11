import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { Mail, AlertCircle } from 'lucide-react';

export const SettingsEmailPage: React.FC = () => {
  const { profile, updateEmail, isLoading, error } = useSettings();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validasyon
    if (!newEmail || !confirmEmail) {
      setFormError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (newEmail !== confirmEmail) {
      setFormError('Email adresleri eşleşmiyor.');
      return;
    }

    if (newEmail === profile?.email) {
      setFormError('Yeni email adresi mevcut email adresinizle aynı olamaz.');
      return;
    }

    try {
      await updateEmail(newEmail);
      setNewEmail('');
      setConfirmEmail('');
    } catch (err) {
      console.error('Email güncellenirken hata:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-bs-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Email Ayarları
            </h2>
            <p className="text-sm text-bs-navygri">
              Email adresinizi güncelleyin
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Mevcut Email */}
        <div className="mb-8 p-4 bg-bs-50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-bs-primary" />
            <span className="font-medium text-bs-navy">Mevcut Email</span>
          </div>
          <p className="text-bs-navygri ml-8">
            {profile?.email}
          </p>
        </div>

        {/* Email Değiştirme Formu */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || formError) && (
            <ErrorMessage message={error || formError} />
          )}

          {/* Yeni Email */}
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Yeni Email Adresi
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                       focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
              placeholder="yeni@email.com"
            />
          </div>

          {/* Email Tekrar */}
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Yeni Email Adresi (Tekrar)
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                       focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
              placeholder="yeni@email.com"
            />
          </div>

          {/* Bilgi Notu */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Önemli Not</p>
              <p>Email adresinizi değiştirdiğinizde:</p>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Yeni email adresinize bir doğrulama bağlantısı gönderilecektir.</li>
                <li>Doğrulama işlemi tamamlanana kadar mevcut email adresiniz aktif kalacaktır.</li>
                <li>Doğrulama işlemini 24 saat içinde tamamlamanız gerekmektedir.</li>
              </ul>
            </div>
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
                  Güncelleniyor...
                </>
              ) : (
                'Email Adresini Güncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};