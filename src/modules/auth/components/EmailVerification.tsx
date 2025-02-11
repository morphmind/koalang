import React from 'react';
import { Mail, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onResendEmail: () => void;
  isResending?: boolean;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onResendEmail,
  isResending = false
}) => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
        <Mail className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-bs-navy mb-4">
        E-posta Adresinizi Doğrulayın
      </h3>
      <p className="text-sm text-bs-navygri mb-6">
        {email} adresine bir doğrulama bağlantısı gönderdik. 
        Lütfen e-posta kutunuzu kontrol edin.
      </p>
      <div className="space-y-4">
        <button
          onClick={onResendEmail}
          disabled={isResending}
          className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-bs-primary 
                   text-bs-primary rounded-xl hover:bg-bs-50 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Tekrar Gönder
            </>
          )}
        </button>
        <p className="text-xs text-bs-navygri">
          E-posta almadıysanız spam klasörünü kontrol edin veya farklı bir e-posta adresi deneyin.
        </p>
      </div>
    </div>
  );
};