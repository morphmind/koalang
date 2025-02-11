import React from 'react';
import { Award, Target, Zap, Trophy, Star, BookOpen, Brain, Activity } from 'lucide-react';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { useProgress } from '../hooks/useProgress';
import { useDashboard } from '../context/DashboardContext';
import { useWords } from '../../words/context/WordContext';
import words from '../../../data/oxford3000';

export const AchievementsPage: React.FC = () => {
  const { isLoading, error } = useProgress();
  const { stats } = useDashboard();
  const { learnedWords, getLearnedWordsCount } = useWords();

  // A1 kelime sayısını hesapla
  const getA1WordCount = () => {
    return words.filter(word => word.level === 'A1').length;
  };

  // Öğrenilen A1 kelime sayısını hesapla
  const getLearnedA1WordCount = (learnedWords: {[key: string]: boolean}) => {
    return words.filter(word => 
      word.level === 'A1' && learnedWords[word.word]
    ).length;
  };

  // A1 seviyesi tamamlandı mı kontrolü
  const isA1Completed = (learnedCount: number) => {
    const learnedA1Count = getLearnedA1WordCount(learnedWords);
    const totalA1Count = getA1WordCount();
    return learnedA1Count === totalA1Count && totalA1Count > 0;
  };

  // A1 ilerleme yüzdesini hesapla
  const calculateA1Progress = (learnedCount: number) => {
    const learnedA1Count = getLearnedA1WordCount(learnedWords);
    const totalA1Count = getA1WordCount();
    return totalA1Count > 0 ? Math.round((learnedA1Count / totalA1Count) * 100) : 0;
  };

  // Başarıları hesapla
  const achievements = React.useMemo(() => {
    const learnedCount = getLearnedWordsCount();
    const quizSuccessRate = stats.successRate || 0;
    const streak = stats.streak || 0;

    return [
      {
        id: 'first_word',
        icon: BookOpen,
        title: 'İlk Adım',
        description: 'İlk kelimeyi öğrendiniz',
        progress: learnedCount > 0 ? 100 : 0,
        color: 'from-green-500 to-emerald-600',
        earned: learnedCount > 0,
        earnedAt: learnedCount > 0 ? new Date() : undefined,
        total: 1,
        current: Math.min(learnedCount, 1)
      },
      {
        id: 'word_master_10',
        icon: Brain,
        title: 'Kelime Ustası I',
        description: '10 kelime öğrendiniz',
        progress: Math.min((learnedCount / 10) * 100, 100),
        color: 'from-blue-500 to-indigo-600',
        earned: learnedCount >= 10,
        earnedAt: learnedCount >= 10 ? new Date() : undefined,
        total: 10,
        current: learnedCount
      },
      {
        id: 'word_master_50',
        icon: Brain,
        title: 'Kelime Ustası II',
        description: '50 kelime öğrendiniz',
        progress: Math.min((learnedCount / 50) * 100, 100),
        color: 'from-indigo-500 to-purple-600',
        earned: learnedCount >= 50,
        earnedAt: learnedCount >= 50 ? new Date() : undefined,
        total: 50,
        current: learnedCount
      },
      {
        id: 'perfect_quiz',
        icon: Target,
        title: 'Mükemmel Sınav',
        description: 'Bir sınavda tüm soruları doğru yanıtladınız',
        progress: quizSuccessRate === 100 ? 100 : Math.min((quizSuccessRate / 100) * 100, 99),
        color: 'from-purple-500 to-pink-600',
        earned: quizSuccessRate === 100,
        earnedAt: quizSuccessRate === 100 ? new Date() : undefined,
        total: 100,
        current: Math.min(quizSuccessRate, 100)
      },
      {
        id: 'daily_streak_7',
        icon: Zap,
        title: '7 Gün Serisi',
        description: '7 gün üst üste kelime öğrendiniz',
        progress: Math.round(Math.min((streak / 7) * 100, 100)),
        color: 'from-orange-500 to-amber-600',
        earned: streak >= 7,
        total: 7, 
        current: Math.min(streak, 7)
      },
      {
        id: 'quiz_master',
        icon: Trophy,
        title: 'Sınav Ustası',
        description: '10 sınavı başarıyla tamamladınız',
        progress: Math.min((stats.quizCount / 10) * 100, 100),
        color: 'from-yellow-500 to-orange-600',
        earned: stats.quizCount >= 10,
        earnedAt: stats.quizCount >= 10 ? new Date() : undefined,
        total: 10,
        current: Math.min(stats.quizCount, 10)
      },
      {
        id: 'level_complete_a1',
        icon: Star,
        title: 'A1 Seviyesi Tamamlandı',
        description: 'A1 seviyesindeki tüm kelimeleri öğrendiniz',
        progress: calculateA1Progress(learnedCount),
        color: 'from-teal-500 to-emerald-600',
        earned: isA1Completed(learnedCount),
        total: getA1WordCount(),
        current: getLearnedA1WordCount(learnedWords)
      },
      {
        id: 'activity_streak',
        icon: Activity,
        title: 'Düzenli Öğrenci',
        description: '30 gün boyunca düzenli aktivite',
        progress: Math.round(Math.min((streak / 30) * 100, 100)),
        color: 'from-cyan-500 to-blue-600',
        earned: streak >= 30,
        total: 30, 
        current: Math.min(streak, 30)
      }
    ];
  }, [stats, getLearnedWordsCount]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  // Kazanılan ve kazanılmayan başarıları ayır
  const earnedAchievements = achievements.filter(a => a.earned);
  const inProgressAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
        {/* Gradient Background */}
        <div className="relative bg-gradient-to-br from-bs-primary to-bs-800 p-8">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Başarılarım
                </h1>
                <p className="text-white/80">
                  Öğrenme yolculuğunuzda kazandığınız başarılar
                </p>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white/80 text-sm mb-1">Kazanılan Başarılar</div>
                <div className="text-2xl font-bold text-white">
                  {earnedAchievements.length} / {achievements.length}
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white/80 text-sm mb-1">Tamamlanma Oranı</div>
                <div className="text-2xl font-bold text-white">
                  {Math.round((earnedAchievements.length / achievements.length) * 100)}%
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white/80 text-sm mb-1">Sıradaki Başarı</div>
                <div className="text-lg font-bold text-white truncate">
                  {inProgressAchievements[0]?.title || 'Tümü Tamamlandı!'}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl 
                       -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl 
                       translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Başarı Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          
          return (
            <div 
              key={achievement.id}
              className={`relative p-6 rounded-2xl border transition-all group overflow-hidden h-[280px]
                       ${achievement.earned 
                         ? 'bg-gradient-to-br from-bs-50 to-white border-bs-primary shadow-lg' 
                         : 'bg-white border-bs-100 hover:border-bs-primary'}
                       hover:shadow-lg hover:-translate-y-1 min-h-[280px] flex flex-col`}
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                              transition-transform group-hover:scale-110 group-hover:rotate-3
                              ${achievement.earned ? 'bg-bs-primary' : 'bg-bs-50'}`}>
                  <Icon className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-bs-primary'}`} />
                </div>
                {achievement.earned && (
                  <div className="px-2 py-1 rounded-full bg-green-50 text-green-600 
                               text-xs font-medium">
                    Kazanıldı
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-semibold text-bs-navy">{achievement.title}</h3>
                <p className="text-sm text-bs-navygri">{achievement.description}</p>
              </div>

              {/* Progress */}
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className={achievement.earned ? 'text-green-600' : 'text-bs-navygri'}>
                    {achievement.earned 
                      ? `Kazanıldı: ${achievement.earnedAt?.toLocaleDateString()}`
                      : achievement.total
                        ? `${achievement.current}/${achievement.total}`
                        : 'Devam ediyor'
                    }
                  </div>
                  <div className="font-medium text-bs-navy">
                    %{achievement.progress}
                  </div>
                </div>
                <div className="h-2 bg-bs-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${achievement.color} rounded-full relative`}
                    style={{ width: `${achievement.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>

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