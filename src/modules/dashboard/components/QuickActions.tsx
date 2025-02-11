import React from 'react';
import { Zap, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

interface QuickAction {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}

export const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      icon: TrendingUp,
      title: 'Sınav Ol',
      description: 'Öğrendiklerini test et',
      href: '/quiz'
    },
    {
      icon: Calendar,
      title: 'Günlük Hedef',
      description: '10 yeni kelime öğren',
      href: '/learn'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-bs-100 overflow-hidden">
      <div className="p-6 border-b border-bs-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-bs-primary" />
          </div>
          <h2 className="text-lg font-semibold text-bs-navy">
            Hızlı Aksiyonlar
          </h2>
        </div>
      </div>
      
      <div className="divide-y divide-bs-100">
        {actions.map((action, index) => (
          <a 
            key={index}
            href={action.href}
            className="flex items-center gap-4 p-4 hover:bg-bs-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center
                         group-hover:bg-white transition-colors">
              <action.icon className="w-5 h-5 text-bs-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-bs-navy">{action.title}</div>
              <div className="text-sm text-bs-navygri truncate">
                {action.description}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-bs-navygri group-hover:text-bs-primary 
                                  group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
};