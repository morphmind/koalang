import React from 'react';
import { BookOpen } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Yükleniyor...' 
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo ve Loading Animasyonu */}
      <div className="relative">
        {/* Logo Container */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 
                     flex items-center justify-center shadow-2xl shadow-bs-primary/20 
                     animate-pulse">
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        {/* Dönen Halka Animasyonu */}
        <div className="absolute -inset-4">
          <div className="w-24 h-24 rounded-2xl border-2 border-bs-primary/20 
                       animate-spin-slow" 
               style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Gradient Dots */}
        <div className="absolute -inset-8 flex items-center justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-bs-primary animate-bounce" 
                 style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-bs-600 animate-bounce" 
                 style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-bs-800 animate-bounce" 
                 style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Marka ve Mesaj */}
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-bs-primary to-bs-800 
                    bg-clip-text text-transparent mb-2">
          koa<span className="text-bs-400">:lang</span>
        </h1>
        <p className="text-bs-navygri animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};