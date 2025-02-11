import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { useWords } from '../../words/context/WordContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { WeeklyChart } from '../components/WeeklyChart';
import { LevelProgress } from '../components/LevelProgress';
import { LearningProgress } from '../components/LearningProgress';
import { Activity, TrendingUp, Award, Target } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { 
    getWeeklyProgress,
    getLevelDistribution,
    getRecentActivities,
    isLoading,
    error
  } = useProgress();
  const { getLearnedWordsCount } = useWords();

  const [weeklyProgress, setWeeklyProgress] = React.useState<number[]>([]);
  const [levelDistribution, setLevelDistribution] = React.useState<{[key: string]: number}>({});
  const [recentActivities, setRecentActivities] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [weeklyData, levelData, activities] = await Promise.all([
          getWeeklyProgress(),
          getLevelDistribution(),
          getRecentActivities(5)
        ]);

        setWeeklyProgress(weeklyData.map(d => d.count));
        setLevelDistribution(levelData);
        setRecentActivities(activities);
      } catch (err) {
        console.error('İlerleme verileri yüklenirken hata:', err);
      }
    };

    loadData();
  }, []);

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

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-bs-50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-bs-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-bs-navy">İlerleme Durumu</h1>
            <p className="text-bs-navygri">
              Öğrenme yolculuğunuzdaki ilerlemenizi takip edin
            </p>
          </div>
        </div>
      </div>

      {/* İlerleme Hedefleri */}
      <LearningProgress 
        weeklyProgress={weeklyProgress}
        levelDistribution={levelDistribution}
        isLoading={isLoading}
        error={error}
      />

      {/* İstatistikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Haftalık İlerleme */}
        <WeeklyChart data={weeklyProgress} />

        {/* Seviye Dağılımı */}
        <LevelProgress distribution={levelDistribution} />
      </div>
    </div>
  );
};