import React, { useEffect, useState } from 'react';
import { User } from '../../auth/types';
import { BookOpen, Award, Activity } from 'lucide-react';
import { useWords } from '../../words/context/WordContext';
import { useDashboard } from '../context/DashboardContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { useLocation } from 'react-router-dom';

interface Stats {
  learnedWords: number;
  successRate: number;
}

interface DashboardHeaderProps {
  user: User;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { stats: dashboardStats, isLoading, error } = useDashboard();
  const location = useLocation();
  const isMainDashboard = location.pathname === '/dashboard';

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-bs-100 p-6 md:p-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-bs-100 p-6 md:p-8">
        <ErrorMessage message={error} />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
      {/* Gradient Background */}
      {isMainDashboard ? (
      <div className="relative bg-gradient-to-br from-bs-primary to-bs-800 p-8">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        
        <div className="relative z-10 min-h-[120px] flex flex-col justify-center">
          {/* Logo ve Marka */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur
                          text-white/90 text-sm font-medium">
              koa<span className="text-bs-400">:lang</span>
            </div>
          </div>

          {/* Başlık ve Açıklama */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Hoş Geldin, {user.username}!
            </h1>
            <p className="text-white/80">
              Öğrenme yolculuğuna devam etmek için hazır mısın?
            </p>
          </div>
        </div>

        {/* Dekoratif Elementler */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl 
                     -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl 
                     translate-y-1/2 -translate-x-1/2" />
      </div>
      ) : null}
      {/* İstatistikler */}
      {isMainDashboard ? (
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x 
                    divide-bs-100">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-bs-primary" />
            </div>
            <div className="text-sm font-medium text-bs-navygri">
              Öğrenilen Kelimeler
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-bs-navy">
              {dashboardStats.learnedWords}
            </div>
            <div className="text-sm text-bs-navygri mt-1">
              / {dashboardStats.totalWords} kelime
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-bs-primary" />
            </div>
            <div className="text-sm font-medium text-bs-navygri">
              Başarı Oranı
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-bs-navy">
              %{dashboardStats.successRate}
            </div>
            <div className="text-sm text-bs-navygri mt-1">
              doğruluk oranı
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-bs-navygri">
              Günlük Seri
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-bs-navy">
              {dashboardStats.streak}
            </div>
            <div className="text-sm text-bs-navygri mt-1">
              gün
            </div>
          </div>
        </div>
      </div> 
      ) : null}
    </div>
  );
};