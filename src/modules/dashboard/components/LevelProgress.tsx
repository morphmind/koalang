import React from 'react';
import { Award } from 'lucide-react';

interface LevelProgressProps {
  distribution: {
    [key: string]: number;
  };
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ distribution }) => {
  const levels = [
    { id: 'A1', label: 'Başlangıç', color: 'bg-green-500' },
    { id: 'A2', label: 'Temel', color: 'bg-blue-500' },
    { id: 'B1', label: 'Orta', color: 'bg-indigo-500' },
    { id: 'B2', label: 'İyi', color: 'bg-purple-500' },
    { id: 'C1', label: 'İleri', color: 'bg-pink-500' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-bs-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
          <Award className="w-5 h-5 text-bs-primary" />
        </div>
        <h3 className="text-lg font-semibold text-bs-navy">
          Seviye Dağılımı
        </h3>
      </div>

      <div className="space-y-4">
        {levels.map(level => {
          const percentage = distribution[level.id] || 0;
          
          return (
            <div key={level.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-bs-navy font-medium">
                  {level.id} - {level.label}
                </span>
                <span className="text-bs-navygri">
                  {percentage}%
                </span>
              </div>
              <div className="h-2 bg-bs-50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${level.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};