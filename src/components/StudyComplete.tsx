'use client';

import { useEffect, useState } from 'react';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  FireIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
}

interface StudyCompleteProps {
  session: StudySession;
  onRestart: () => void;
  onDashboard: () => void;
}

export default function StudyComplete({ 
  session, 
  onRestart, 
  onDashboard 
}: StudyCompleteProps) {
  const [timeSpent, setTimeSpent] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Calculate time spent
    const start = new Date(session.startTime);
    const end = session.endTime ? new Date(session.endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 1) {
      setTimeSpent('less than a minute');
    } else if (diffMins === 1) {
      setTimeSpent('1 minute');
    } else if (diffMins < 60) {
      setTimeSpent(`${diffMins} minutes`);
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      setTimeSpent(`${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`);
    }
    
    // Show confetti for good performance
    if (session.cardsStudied > 0 && (session.correctAnswers / session.cardsStudied) >= 0.7) {
      setShowConfetti(true);
    }
  }, [session]);
  
  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const canvasConfetti = () => {
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { y: 0.6 }
        });
        
        if (Date.now() < animationEnd) {
          requestAnimationFrame(canvasConfetti);
        }
      };
      
      canvasConfetti();
    }
  }, [showConfetti]);
  
  const correctPercentage = session.cardsStudied > 0 
    ? Math.round((session.correctAnswers / session.cardsStudied) * 100) 
    : 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 text-center max-w-2xl mx-auto">
      <div className="flex flex-col items-center">
        <AcademicCapIcon className="h-16 w-16 text-primary-600 dark:text-primary-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Study Session Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Great job! You've completed your study session.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <ClockIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{timeSpent}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <CheckCircleIcon className="h-8 w-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Cards Studied</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{session.cardsStudied}</p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <FireIcon className="h-8 w-8 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{correctPercentage}%</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <button
          onClick={onRestart}
          className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Study Again
        </button>
        <button
          onClick={onDashboard}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
} 