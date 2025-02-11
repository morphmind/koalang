import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-bs-navy text-center">
          Hesabınıza Giriş Yapın
        </h3>
        <p className="mt-2 text-sm text-bs-navygri text-center">
          Henüz hesabınız yok mu?{' '}
          <Link to="/register" className="font-medium text-bs-primary hover:text-bs-800">
            Hemen ücretsiz kayıt olun
          </Link>
        </p>
      </div>

      <LoginForm />

      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-bs-primary hover:text-bs-800"
        >
          Şifrenizi mi unuttunuz?
        </Link>
      </div>
    </div>
  );
};