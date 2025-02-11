import React from 'react';

interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onClick: () => void;
}

const PROVIDER_CONFIG = {
  google: {
    icon: 'https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg',
    label: 'Google',
    bgColor: 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  },
  facebook: {
    icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg',
    label: 'Facebook',
    bgColor: 'bg-[#1877F2] hover:bg-[#0C63D4] shadow-md hover:shadow-lg',
    textColor: 'text-white',
    borderColor: 'border-transparent'
  },
  apple: {
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg',
    label: 'Apple',
    bgColor: 'bg-black hover:bg-gray-900 shadow-md hover:shadow-lg',
    textColor: 'text-white',
    borderColor: 'border-transparent'
  }
};

export const SocialButton: React.FC<SocialButtonProps> = ({ 
  provider, 
  onClick
}) => {
  const config = PROVIDER_CONFIG[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-12 h-12 rounded-xl
                 border transition-all duration-200 ${config.bgColor} ${config.textColor} 
                 ${config.borderColor} relative overflow-hidden group hover:-translate-y-0.5`}
      title={`${config.label} ile devam et`}
    >
      {/* Hover Overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/5 opacity-0 
                    group-hover:opacity-100 transition-opacity" />
      
      {/* Icon */}
      <img
        src={config.icon}
        alt={config.label}
        className="w-5 h-5"
      />
    </button>
  );
};

export const SocialButtons: React.FC = () => {
  const handleSocialLogin = async (provider: string) => {
    try {
      // TODO: Implement social login
      console.log(`${provider} ile giriş yapılıyor...`);
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <SocialButton
        provider="google"
        onClick={() => handleSocialLogin('google')}
      />
      <SocialButton
        provider="facebook"
        onClick={() => handleSocialLogin('facebook')}
      />
      <SocialButton
        provider="apple"
        onClick={() => handleSocialLogin('apple')}
      />
    </div>
  );
};