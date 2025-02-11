import React from 'react';
import { TrendingUp, BookOpen, Award, ChevronRight, Target, Brain, Zap } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface LearningProgressProps {
  weeklyProgress: number[];
  levelDistribution: {
    [key: string]: number;
  };
  isLoading: boolean;
  error: string | null;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  weeklyProgress,
  levelDistribution,
  isLoading,
  error
}) => {
  const { stats } = useDashboard();

  // Günlük hedef: Seviyeye göre dinamik hedef
  const dailyGoal = {
    icon: Target,
    title: 'Günlük Hedef',
    progress: weeklyProgress[weeklyProgress.length - 1] || 0, // Bugünün ilerlemesi
    total: stats.learnedWords < 100 ? 5 : stats.learnedWords < 500 ? 10 : 15,
    color: 'from-green-500 to-emerald-600'
  };

  // Haftalık hedef: Günlük hedefin 5 katı
  const weeklyGoal = {
    icon: Brain,
    title: 'Haftalık Hedef',
    progress: weeklyProgress.reduce((sum, day) => sum + day, 0), // Haftalık toplam
    total: dailyGoal.total * 5,
    color: 'from-blue-500 to-indigo-600'
  };

  // Öğrenme serisi
  const streak = {
    icon: Zap,
    title: 'Seri',
    progress: stats.streak,
    total: stats.streak,
    color: 'from-amber-500 to-orange-600'
  };

  const learningGoals = [dailyGoal, weeklyGoal, streak];

  return (
    <div className="bg-white rounded-2xl border border-bs-100 overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-6 border-b border-bs-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-bs-navy">
              İlerleme Durumu
            </h2>
            <p className="text-sm text-bs-navygri">
              Günlük ve haftalık ilerlemenizi takip edin
            </p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="/dashboard/progress" 
              className="text-sm font-medium text-bs-primary hover:text-bs-800 
                       flex items-center gap-1 group"
            >
              Detaylı Analiz
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

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
      ) : (
        <div className="p-6">
          {/* Öğrenme Hedefleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningGoals.map((goal, index) => (
              <div 
                key={index}
                className="relative p-4 rounded-xl border border-bs-100 transition-all group
                         hover:shadow-lg hover:-translate-y-1 hover:border-bs-primary overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center
                               transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <goal.icon className="w-5 h-5 text-bs-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-bs-navy">{goal.title}</div>
                    <div className="text-xs text-bs-navygri">
                      {goal.progress} / {goal.total}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-bs-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${goal.color} rounded-full relative`}
                    style={{ width: `${(goal.progress / goal.total) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-bs-navygri mt-2">
                  <span>
                    {goal.title === 'Günlük Hedef' && 'Bugün'}
                    {goal.title === 'Haftalık Hedef' && 'Bu hafta'}
                    {goal.title === 'Seri' && 'Aktif seri'}
                  </span>
                  <span className="font-medium">
                    {goal.title === 'Seri' ? `${goal.progress} gün` : `${goal.progress}/${goal.total}`}
                  </span>
                </div>

                {/* Dekoratif Arka Plan */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-bs-50 to-transparent 
                             rounded-full blur-3xl -translate-y-24 translate-x-24 group-hover:translate-x-16 
                             transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* Motivasyon Mesajı */}
          <div className="mt-6 p-4 bg-gradient-to-r from-bs-primary to-bs-800 rounded-xl text-white 
                       relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="font-medium">Öğrenme Hedefleri</div>
              </div>
              <p className="text-sm text-white/80">
                Hedefleriniz öğrenme seviyenize göre otomatik olarak belirlenir. İlk 100 kelimede günlük 5, 500 kelimeye kadar günlük 10, sonrasında günlük 15 kelime hedefi verilir.
              </p>
            </div>
            
            {/* Dekoratif Arka Plan */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl 
                         -translate-y-32 translate-x-32 group-hover:translate-x-24 transition-transform" />
          </div>
        </div>
      )}
    </div>
  );
};