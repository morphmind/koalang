import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  total?: number;
  color: string;
  bg: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  total,
  color,
  bg
}) => {
  return (
    <div className="bg-white rounded-2xl border border-bs-100 p-6 hover:shadow-lg 
                   transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-bs-navy">
            {value}
          </div>
          {total && (
            <div className="text-sm text-bs-navygri">
              / {total} toplam
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-bs-navygri">{label}</div>
    </div>
  );
};