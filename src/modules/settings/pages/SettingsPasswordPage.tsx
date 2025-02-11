import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { Key, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SettingsPasswordPage: React.FC = () => {
  const { updatePassword, isLoading, error } = useSettings();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Şifre gücü kontrolü
  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      isStrong: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough,
      checks: [
        { label: 'En az 8 karakter', passed: isLongEnough },
        { label: 'En az bir büyük harf', passed: hasUpperCase },
        { label: 'En az bir küçük harf', passed: hasLowerCase },
        { label: 'En az bir rakam', passed: hasNumbers },
        { label: 'En az bir özel karakter', passed: hasSpecialChar }
      ]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    // Validasyon
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setFormError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFormError('Yeni şifreler eşleşmiyor.');
      return;
    }

    const { isStrong } = checkPasswordStrength(formData.newPassword);
    if (!isStrong) {
      setFormError('Yeni şifreniz güvenlik kriterlerini karşılamıyor.');
      return;
    }

    try {
      await updatePassword(formData.newPassword);
      setSuccessMessage('Şifreniz başarıyla güncellendi.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Şifre güncellenirken hata:', err);
    }
  };

  const passwordStrength = checkPasswordStrength(formData.newPassword);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-bs-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
            <Key className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="pt-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              Şifre Ayarları
            </h2>
            <p className="text-sm text-bs-navygri">
              Hesap şifrenizi güncelleyin
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || formError) && (
            <ErrorMessage message={error || formError} />
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 text-green-800 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{successMessage}</div>
            </div>
          )}

          {/* Mevcut Şifre */}
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Mevcut Şifre
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full pr-12 pl-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                         focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5 text-bs-navygri" />
                ) : (
                  <Eye className="w-5 h-5 text-bs-navygri" />
                )}
              </button>
            </div>
          </div>

          {/* Yeni Şifre */}
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full pr-12 pl-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                         focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5 text-bs-navygri" />
                ) : (
                  <Eye className="w-5 h-5 text-bs-navygri" />
                )}
              </button>
            </div>
          </div>

          {/* Şifre Tekrar */}
          <div>
            <label className="block text-sm font-medium text-bs-navy mb-2">
              Yeni Şifre (Tekrar)
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full pr-12 pl-4 py-3 rounded-lg border border-bs-100 focus:ring-2 
                         focus:ring-bs-primary/10 focus:border-bs-primary transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5 text-bs-navygri" />
                ) : (
                  <Eye className="w-5 h-5 text-bs-navygri" />
                )}
              </button>
            </div>
          </div>

          {/* Şifre Gücü Göstergesi */}
          {formData.newPassword && (
            <div className="p-4 bg-bs-50 rounded-xl">
              <h3 className="text-sm font-medium text-bs-navy mb-3">
                Şifre Güvenlik Kriterleri
              </h3>
              <div className="space-y-2">
                {passwordStrength.checks.map((check, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-bs-navygri" />
                    )}
                    <span className={`text-sm ${check.passed ? 'text-green-600' : 'text-bs-navygri'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bilgi Notu */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Önemli Not</p>
              <p>Şifrenizi değiştirdiğinizde:</p>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Tüm aktif oturumlarınız sonlandırılacaktır.</li>
                <li>Yeni şifrenizle tekrar giriş yapmanız gerekecektir.</li>
                <li>Email adresinize bir bilgilendirme gönderilecektir.</li>
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
                'Şifreyi Güncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};