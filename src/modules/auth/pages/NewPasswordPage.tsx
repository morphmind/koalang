import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const NewPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Şifre validasyonu
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);

    try {
      // Supabase'den gelen token'ı al
      const token = searchParams.get('token');
      if (!token) {
        throw new Error('Geçersiz veya eksik token');
      }

      // Şifre güncelleme işlemi
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      // Başarılı mesajı göster ve login sayfasına yönlendir
      navigate('/login', { 
        state: { 
          message: 'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.' 
        }
      });
    } catch (err) {
      setError('Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-bs-navy text-center">
          Yeni Şifre Belirleyin
        </h3>
        <p className="mt-2 text-sm text-bs-navygri text-center">
          Lütfen yeni şifrenizi belirleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Yeni Şifre */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-bs-navy">
            Yeni Şifre
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-bs-navygri" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-3.5 text-sm text-bs-navy placeholder-bs-navygri/50
                       bg-white border border-bs-100 rounded-xl shadow-sm
                       focus:ring focus:ring-bs-primary/10 focus:border-bs-primary"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-bs-navygri" />
              ) : (
                <Eye className="h-5 w-5 text-bs-navygri" />
              )}
            </button>
          </div>
        </div>

        {/* Şifre Tekrar */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-bs-navy">
            Şifre Tekrar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-bs-navygri" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-3.5 text-sm text-bs-navy placeholder-bs-navygri/50
                       bg-white border border-bs-100 rounded-xl shadow-sm
                       focus:ring focus:ring-bs-primary/10 focus:border-bs-primary"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <ErrorMessage message={error} />
        )}

        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
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
                Güncelleniyor...
              </>
            ) : (
              'Şifreyi Güncelle'
            )}
          </span>
        </button>
      </form>
    </div>
  );
};