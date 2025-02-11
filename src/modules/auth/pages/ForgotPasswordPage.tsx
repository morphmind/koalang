import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, error, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-bs-navy mb-4">
          Şifre Sıfırlama Bağlantısı Gönderildi
        </h3>
        <p className="text-sm text-bs-navygri mb-6">
          {email} adresine şifre sıfırlama bağlantısı gönderdik. 
          Lütfen e-posta kutunuzu kontrol edin.
        </p>
        <Link
          to="/login"
          className="text-sm font-medium text-bs-primary hover:text-bs-800"
        >
          Giriş sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-bs-navy text-center">
          Şifrenizi Sıfırlayın
        </h3>
        <p className="mt-2 text-sm text-bs-navygri text-center">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-bs-navy">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-bs-100 px-4 py-3 
                     text-bs-navy shadow-sm focus:border-bs-primary focus:ring-bs-primary"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent 
                   rounded-xl shadow-sm text-sm font-medium text-white bg-bs-primary 
                   hover:bg-bs-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-bs-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-bs-primary hover:text-bs-800"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </form>
    </div>
  );
};