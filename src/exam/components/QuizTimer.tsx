import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  startTime: Date;
  isCompleted?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ startTime, isCompleted = false }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <span className="font-medium">{formatTime(elapsedTime)}</span>
  );
};