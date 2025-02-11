import React, { useState } from 'react';
import { AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ResetPasswordFormProps {
  onBack: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
          <Mail className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-bs-navy mb-4">
          Şifre Sıfırlama Bağlantısı Gönderildi
        </h3>
        <p className="text-sm text-bs-navygri mb-6">
          {email} adresine şifre sıfırlama bağlantısı gönderdik. 
          Lütfen e-posta kutunuzu kontrol edin.
        </p>
        <div className="space-y-4">
          <button
            onClick={onBack}
            className="w-full flex justify-center items-center px-4 py-3 border border-bs-primary 
                     text-bs-primary rounded-xl hover:bg-bs-50 transition-colors"
          >
            Giriş sayfasına dön
          </button>
          <button
            onClick={() => {
              setEmail('');
              setIsSubmitted(false);
            }}
            className="text-sm text-bs-primary hover:text-bs-800"
          >
            Farklı bir e-posta adresi dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-bs-navygri text-center">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-bs-navy">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-bs-navygri" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 text-sm text-bs-navy placeholder-bs-navygri/50
                       bg-white border border-bs-100 rounded-xl shadow-sm
                       focus:ring focus:ring-bs-primary/10 focus:border-bs-primary"
              placeholder="ornek@email.com"
              required
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full relative flex items-center justify-center px-4 py-3.5 text-sm font-medium
                   text-white bg-gradient-to-r from-bs-primary to-bs-800 rounded-xl
                   hover:from-bs-800 hover:to-bs-primary focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-bs-primary disabled:opacity-50 
                   disabled:cursor-not-allowed transition-all duration-200 group"
        >
          <span className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-bs-primary 
                        to-bs-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                Gönderiliyor...
              </>
            ) : (
              'Şifre Sıfırlama Bağlantısı Gönder'
            )}
          </span>
        </button>
      </form>
    </div>
  );
};