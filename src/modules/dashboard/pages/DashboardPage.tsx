import React from 'react';
import { DashboardOverview } from '../components/DashboardOverview';
import { LearningProgress } from '../components/LearningProgress';
import { RecentActivity } from '../components/RecentActivity';
import { SuggestedWords } from '../components/SuggestedWords';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { useDashboard } from '../context/DashboardContext';
import { useWords } from '../../words/context/WordContext';
import { useProgress } from '../hooks/useProgress';
import { Word } from '../../../data/oxford3000.types';
import { words } from '../../../data/oxford3000';

export const DashboardPage: React.FC = () => {
  const { stats, isLoading, error } = useDashboard();
  const { 
    getWeeklyProgress,
    getLevelDistribution,
    getRecentActivities,
    isLoading: loadingProgress,
    error: progressError
  } = useProgress();
  const {
    getSuggestedWords,
    toggleWordLearned,
    isLoading: loadingWords,
    error: suggestedError
  } = useWords();
  const [suggestedWords, setSuggestedWords] = React.useState<Word[]>([]);
  const [weeklyProgress, setWeeklyProgress] = React.useState<number[]>([]);
  const [levelDistribution, setLevelDistribution] = React.useState<{[key: string]: number}>({});
  const [recentActivities, setRecentActivities] = React.useState([]);

  // İlerleme verilerini yükle
  React.useEffect(() => {
    const loadProgressData = async () => {
      try {
        const [weeklyData, levelData, activities] = await Promise.all([
          getWeeklyProgress(),
          getLevelDistribution(),
          getRecentActivities(5)
        ]);

        // Haftalık ilerlemeyi düzenle
        const weeklyValues = weeklyData.map(item => item.count);
        setWeeklyProgress(weeklyValues);

        // Seviye dağılımını ayarla
        setLevelDistribution(levelData);

        // Son aktiviteleri ayarla
        setRecentActivities(activities);
      } catch (err) {
        console.error('İlerleme verileri yüklenirken hata:', err);
      }
    };

    loadProgressData();
  }, [getWeeklyProgress, getLevelDistribution, getRecentActivities, stats.learnedWords]);

  // Önerilen kelimeleri yükle
  React.useEffect(() => {
    const loadSuggestedWords = async () => {
      try {
        const suggested = await getSuggestedWords(6);
        setSuggestedWords(suggested);
      } catch (err) {
        console.error('Önerilen kelimeler yüklenirken hata:', err);
      }
    };

    loadSuggestedWords();
  }, [stats.learnedWords, getSuggestedWords]);

  const handleLearnWord = async (word: Word) => {
    try {
      await toggleWordLearned(word.word);
      // Önerilen kelimeleri ve istatistikleri güncelle
      const suggested = await getSuggestedWords(6);
      setSuggestedWords(suggested);
    } catch (err) {
      console.error('Kelime öğrenildi olarak işaretlenirken hata:', err);
    }
  };

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading || loadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || progressError) {
    return (
      <div className="p-4">
        <ErrorMessage message={error || progressError} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Genel Bakış */}
      <DashboardOverview stats={stats} />

      {/* İlerleme, Aktiviteler ve Önerilen Kelimeler */}
      <div className="space-y-8">
        {/* Önerilen Kelimeler - Yatay Kart */}
        <SuggestedWords
          words={suggestedWords}
          isLoading={loadingWords}
          error={suggestedError}
          onLearn={handleLearnWord} 
          onSpeak={handleSpeak}
          limit={6}
        />

        {/* İlerleme ve Aktiviteler - Yan Yana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LearningProgress 
            weeklyProgress={weeklyProgress}
            levelDistribution={levelDistribution}
            isLoading={loadingProgress}
            error={progressError}
          />
          <RecentActivity 
            activities={recentActivities} 
            isLoading={loadingProgress}
            error={progressError}
          />
        </div>
      </div>
    </div>
  );
};