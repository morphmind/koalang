import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-bs-navy text-center">
          Yeni Hesap Oluşturun
        </h3>
        <p className="mt-2 text-sm text-bs-navygri text-center">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="font-medium text-bs-primary hover:text-bs-800">
            Giriş yapın
          </Link>
        </p>
      </div>

      <RegisterForm />
    </div>
  );
};