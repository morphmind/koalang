import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bs-primary to-bs-800 
                         flex items-center justify-center shadow-lg shadow-bs-primary/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-bs-navy">
          Oxford 3000™ Kelime
        </h2>
        <p className="mt-2 text-center text-sm text-bs-navygri">
          Özel ders alanında İngilizce öğrenmenin en etkili yolu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-bs-primary/5 sm:rounded-xl sm:px-10 
                       border border-bs-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};