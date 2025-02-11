import React from 'react';
import { BookOpen } from 'lucide-react';

interface WeeklyChartProps {
  data: number[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const maxValue = Math.max(...data, 1); // En az 1 olsun ki 0'a bölme olmasın

  return (
    <div className="bg-white rounded-2xl border border-bs-100 p-6">
      {/* Başlık */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-bs-primary" />
        </div>
        <div className="pt-1">
          <h3 className="text-lg font-semibold text-bs-navy">
            Haftalık İlerleme
          </h3>
          <p className="text-sm text-bs-navygri">
            Son 7 gündeki öğrenme aktiviten
          </p>
        </div>
      </div>

      {/* Grafik */}
      <div className="mt-8 flex items-end gap-2 h-[200px] relative group">
        {data.map((value, index) => {
          const height = Math.max((value / maxValue) * 100, 5); // En az 5% yükseklik
          const isToday = index === data.length - 1;
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              {/* Bar */}
              <div className="w-full h-full relative">
                <div 
                  className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500
                           ${isToday ? 'bg-bs-primary' : 'bg-bs-100 hover:bg-bs-200'}`}
                  style={{ height: `${height}%` }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bs-800/10 to-transparent" />
                </div>
                
                {/* Hover Info */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bs-navy text-white 
                             px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 
                             transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {value} kelime
                </div>
              </div>

              {/* Gün Etiketi */}
              <div className={`text-xs font-medium mt-2 ${isToday ? 'text-bs-primary' : 'text-bs-navygri'}`}>
                {days[index]}
              </div>
            </div>
          );
        })}

        {/* Yatay Çizgiler */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-full h-px bg-bs-100"
              style={{
                opacity: 1 - (i * 0.15)
              }}
            />
          ))}
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="mt-6 pt-6 border-t border-bs-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-bs-navygri">
            Bu hafta
          </div>
          <div className="font-medium text-bs-navy">
            {data.reduce((a, b) => a + b, 0)} kelime öğrenildi
          </div>
        </div>
      </div>
    </div>
  );
};