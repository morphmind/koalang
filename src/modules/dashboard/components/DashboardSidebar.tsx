import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, Activity, Settings, ChevronRight, Zap, Brain, Target, Trophy, PenTool } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../../auth/context/AuthContext';
import { useWords } from '../../words/context/WordContext';
import { useAuthPopup } from '../../auth/hooks/useAuthPopup';

export const DashboardSidebar: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useDashboard();
  const { getLearnedWordsCount } = useWords();
  const { openAuthPopup } = useAuthPopup(); 
  const [showQuiz, setShowQuiz] = React.useState(false);

  const handleQuizClick = () => {
    if (!user) {
      openAuthPopup();
      return;
    }
    // Quiz popup'ını aç 
    const event = new CustomEvent('showQuiz', { detail: { show: true } });
    window.dispatchEvent(event);
  };

  // Kazanılan rozetleri hesapla
  const badges = React.useMemo(() => {
    const learnedCount = getLearnedWordsCount();
    const quizSuccessRate = stats.successRate || 0;
    const streak = stats.streak || 0;

    return [
      {
        id: 'beginner',
        icon: BookOpen,
        title: 'Başlangıç',
        color: 'bg-green-500',
        earned: learnedCount >= 10,
        description: '10+ kelime öğrenildi'
      },
      {
        id: 'intermediate',
        icon: Brain,
        title: 'Orta Seviye',
        color: 'bg-blue-500',
        earned: learnedCount >= 50,
        description: '50+ kelime öğrenildi'
      },
      {
        id: 'advanced',
        icon: Award,
        title: 'İleri Seviye',
        color: 'bg-purple-500',
        earned: learnedCount >= 100,
        description: '100+ kelime öğrenildi'
      },
      {
        id: 'master',
        icon: Trophy,
        title: 'Kelime Ustası',
        color: 'bg-amber-500',
        earned: learnedCount >= 500,
        description: '500+ kelime öğrenildi'
      },
      {
        id: 'quiz_master',
        icon: Target,
        title: 'Sınav Ustası',
        color: 'bg-indigo-500',
        earned: quizSuccessRate >= 90,
        description: '%90+ başarı oranı'
      },
      {
        id: 'streak_master',
        icon: Zap,
        title: 'Seri Ustası',
        color: 'bg-pink-500',
        earned: streak >= 30,
        description: '30+ gün seri'
      }
    ];
  }, [stats, getLearnedWordsCount]);

  // Kazanılan rozetleri filtrele
  const earnedBadges = badges.filter(badge => badge.earned);

  const location = useLocation();

  const menuItems = [
    {
      icon: BookOpen,
      label: 'Ana Sayfa',
      href: '/dashboard',
      description: 'Kelime öğrenmeye devam et'
    },
    {
      icon: BookOpen,
      label: 'Öğrendiğim Kelimeler',
      href: '/dashboard/learned-words',
      description: 'Öğrendiğin kelimeleri gör'
    },
    {
      icon: Activity,
      label: 'İlerlemem',
      href: '/dashboard/progress',
      description: 'İlerleme durumunu gör'
    },
    {
      icon: Award,
      label: 'Başarılarım',
      href: '/dashboard/achievements',
      description: 'Kazandığın başarılar'
    },
    {
      icon: Settings,
      label: 'Ayarlar',
      href: '/dashboard/settings',
      description: 'Hesap ayarlarını yönet'
    }
  ];

  return (
    <aside className="lg:col-span-3 lg:sticky lg:top-8 space-y-6">
      {/* Profil Kartı */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
        <div className="bg-gradient-to-br from-bs-primary to-bs-800">
          {/* Avatar */}
          <div className="flex flex-col items-center pt-8 pb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4
                         ring-4 ring-white/20 shadow-lg relative z-10">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <div className="text-3xl font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-1">
                {user.username}
              </h2>
              <p className="text-sm text-white/70">
                {user.email}
              </p>
            </div>
          </div>

          {/* Rozetler */}
          {earnedBadges.length > 0 && (
            <div className="px-6 py-4 border-t border-white/10 bg-white/5">
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={badge.id}
                      className="group relative flex items-center justify-center"
                      title={`${badge.title} - ${badge.description}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${badge.color} flex items-center justify-center
                                   shadow-lg transition-transform group-hover:scale-110 group-hover:-translate-y-1`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2
                                   bg-white/95 backdrop-blur-sm rounded-lg shadow-xl text-xs whitespace-nowrap opacity-0 
                                  group-hover:opacity-100 transition-all duration-200 pointer-events-none
                                  min-w-[120px] z-[99999] transform -translate-y-2 group-hover:translate-y-0
                                  border border-bs-100">
                        <div className="font-medium text-bs-navy">{badge.title}</div>
                        <div className="text-bs-navygri">{badge.description}</div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white 
                                    transform rotate-45 border-r border-b border-bs-100"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigasyon */}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all relative group
                              ${isActive 
                                ? 'bg-gradient-to-r from-bs-primary to-bs-800 text-white shadow-lg shadow-bs-primary/20 hover:shadow-xl' 
                                : 'text-bs-navy hover:bg-bs-50 hover:-translate-y-0.5 hover:shadow-md'}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
                                  ${isActive 
                                    ? 'bg-white/10 text-white group-hover:bg-white/20' 
                                    : 'bg-bs-50 text-bs-navygri group-hover:text-bs-primary group-hover:scale-110'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium mb-0.5 ${isActive ? 'group-hover:text-white' : ''}`}>{item.label}</div>
                      <div className={`text-xs truncate ${isActive 
                        ? 'text-white/80 group-hover:text-white' 
                        : 'text-bs-navygri group-hover:text-bs-navy'}`}>
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform
                                          ${isActive ? 'text-white/80 group-hover:text-white' : 'text-bs-navygri group-hover:text-bs-navy'}
                                          group-hover:translate-x-1`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden">
        <div className="p-4 border-b border-bs-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-bs-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-bs-primary" />
            </div>
            <h3 className="text-sm font-semibold text-bs-navy">
              Hızlı Aksiyonlar
            </h3>
          </div>
        </div>
        
        <div className="divide-y divide-bs-100">
          <div
            role="button"
            tabIndex={0}
            onClick={handleQuizClick}
            onKeyPress={(e) => e.key === 'Enter' && handleQuizClick()}
            className="w-full flex items-center gap-3 p-4 hover:bg-bs-50 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-bs-50 flex items-center justify-center
                         group-hover:bg-white transition-colors">
              <PenTool className="w-4 h-4 text-bs-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium text-sm text-bs-navy">Sınav Ol</div>
              <div className="text-xs text-bs-navygri truncate">
                Öğrendiklerini test et
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-bs-navygri group-hover:text-bs-primary 
                                  group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* İlerleme Özeti */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-bs-navy">Öğrenme İlerlemen</div>
          <div className="text-2xl font-bold text-bs-primary">
            %{Math.round((stats.learnedWords / stats.totalWords) * 100)}
          </div>
        </div>
        <div className="h-2 bg-bs-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-bs-primary to-bs-800 rounded-full relative"
            style={{ 
              width: `${Math.round((stats.learnedWords / stats.totalWords) * 100)}%` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                          animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
        <div className="mt-4 text-xs text-bs-navygri">
          {stats.learnedWords} kelime öğrendin
        </div>
        
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-bs-50 to-transparent 
                     rounded-full blur-3xl -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-bs-50 to-transparent 
                     rounded-full blur-2xl translate-y-16 -translate-x-16" />
      </div>
    </aside>
  );
};