import React from 'react';
import { History, CheckCircle2, XCircle, ChevronRight, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Activity } from '../types';

interface RecentActivityProps {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities,
  isLoading,
  error
}) => {
  // Aktivite ikonu
  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'quiz') {
      return activity.result === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      );
    }
    return <BookOpen className="w-5 h-5 text-bs-primary" />;
  };

  // Aktivite arka plan rengi
  const getActivityBg = (activity: Activity) => {
    if (activity.type === 'quiz') {
      return activity.result === 'success' ? 'bg-green-50' : 'bg-red-50';
    }
    return 'bg-bs-50';
  };

  return (
    <div className="bg-white rounded-2xl border border-bs-100 overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-bs-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center flex-shrink-0">
            <History className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-bs-navy mb-1">
              Son Aktiviteler
            </h2>
            <p className="text-sm text-bs-navygri">
              Öğrenme yolculuğundaki son adımların
            </p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="/dashboard/activities" 
              className="text-sm font-medium text-bs-primary hover:text-bs-800 
                       flex items-center gap-1 group"
            >
              Tümünü Gör
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-8 h-8 border-4 border-bs-100 border-t-bs-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px] px-6 text-center">
          <div className="text-bs-navygri">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="block mt-2 text-sm text-bs-primary hover:text-bs-800"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] px-6 text-center">
          <div className="text-bs-navygri">
            Henüz hiç aktiviten yok.
            <p className="mt-2 text-sm">
              Kelime öğrenmeye başla veya bir sınav çöz!
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-bs-100 max-h-[400px] overflow-y-auto">
          {activities.map(activity => (
            <div 
              key={activity.id}
              className="p-3 sm:p-4 hover:bg-bs-50 transition-all hover:-translate-y-0.5 flex items-center gap-4 group"
            >
              {/* Result Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                            ${getActivityBg(activity)}`}
              >
                {getActivityIcon(activity)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-bs-navy">{activity.title}</div>
                <div className="text-sm text-bs-navygri truncate">
                  {activity.description}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-bs-navygri whitespace-nowrap">
                {formatDistanceToNow(activity.timestamp, { 
                  addSuffix: true,
                  locale: tr 
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};