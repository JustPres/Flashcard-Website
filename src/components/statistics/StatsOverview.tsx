'use client';

import { useEffect, useState } from 'react';
import { StudySession } from '@/types';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';

interface StatsProps {
  sessions: StudySession[];
}

export default function StatsOverview({ sessions }: StatsProps) {
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [totalCardsStudied, setTotalCardsStudied] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!sessions.length) return;

    // Calculate total study time in minutes
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0) / 60;
    setTotalStudyTime(Math.round(totalTime * 10) / 10); // Round to 1 decimal place

    // Calculate total cards studied
    const cards = sessions.reduce((sum, session) => sum + session.cardsStudied, 0);
    setTotalCardsStudied(cards);

    // Calculate accuracy percentage
    const correct = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const total = sessions.reduce((sum, session) => sum + session.cardsStudied, 0);
    setAccuracy(total > 0 ? Math.round((correct / total) * 100) : 0);

    // Calculate current streak (consecutive days with study sessions)
    const calculateStreak = () => {
      if (sessions.length === 0) return 0;
      
      // Sort sessions by date (newest first)
      const sortedSessions = [...sessions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      let currentStreak = 0;
      let currentDate = new Date();
      const today = new Date().setHours(0, 0, 0, 0);
      
      // Check if studied today
      const studiedToday = sortedSessions.some(session => 
        new Date(session.date).setHours(0, 0, 0, 0) === today
      );
      
      if (!studiedToday) {
        // Check if studied yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const studiedYesterday = sortedSessions.some(session => 
          new Date(session.date).setHours(0, 0, 0, 0) === yesterday.getTime()
        );
        
        if (!studiedYesterday) return 0;
      }
      
      // Start counting streak
      const dateMap = new Map();
      
      // Group sessions by date
      sortedSessions.forEach(session => {
        const sessionDate = new Date(session.date).setHours(0, 0, 0, 0);
        dateMap.set(sessionDate, true);
      });
      
      // Count consecutive days
      for (let i = 0; i <= 366; i++) { // Check up to a year
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkTime = checkDate.setHours(0, 0, 0, 0);
        
        if (dateMap.has(checkTime)) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      return currentStreak;
    };
    
    setStreak(calculateStreak());
  }, [sessions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Study Statistics</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Study Time */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Study Time</h3>
          </div>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalStudyTime} min</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Total time spent studying</p>
        </div>
        
        {/* Total Cards Studied */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <ChartBarIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Cards Studied</h3>
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">{totalCardsStudied}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Total cards reviewed</p>
        </div>
        
        {/* Accuracy */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckIcon className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
            <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Accuracy</h3>
          </div>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{accuracy}%</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Correct answer rate</p>
        </div>
        
        {/* Current Streak */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-amber-500 dark:text-amber-400 mr-2">🔥</span>
            <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">Streak</h3>
          </div>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">{streak} day{streak !== 1 ? 's' : ''}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Consecutive study days</p>
        </div>
      </div>
      
      {sessions.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>No study data available yet. Start studying to see your statistics!</p>
        </div>
      )}
    </div>
  );
} 