import React from 'react';
import { BookOpen, Award, Activity } from 'lucide-react';
import { DashboardStats as Stats } from '../types';

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      icon: BookOpen,
      label: 'Öğrenilen Kelimeler',
      value: stats.learnedWords,
      total: stats.totalWords,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: Award,
      label: 'Başarı Oranı',
      value: `%${stats.successRate}`,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Activity,
      label: 'Günlük Seri',
      value: `${stats.streak} gün`,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-bs-100 p-6">
      {/* Başlık */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-bs-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-bs-navy">
            Genel İstatistikler
          </h3>
          <p className="text-sm text-bs-navygri">
            Öğrenme yolculuğundaki ilerlemen
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div 
              key={index}
              className="relative p-6 rounded-xl border border-bs-100 transition-all group
                       hover:shadow-lg hover:-translate-y-1 hover:border-bs-primary overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center
                              transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-bs-navy">
                    {card.value}
                  </div>
                  {card.total && (
                    <div className="text-sm text-bs-navygri">
                      / {card.total} toplam
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-bs-navygri relative z-10">{card.label}</div>

              {/* Dekoratif Arka Plan */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-bs-50 to-transparent 
                           rounded-full blur-3xl -translate-y-24 translate-x-24 group-hover:translate-x-16 
                           transition-transform duration-500" />
            </div>
          );
        })}
      </div>
    </div>
  );
};