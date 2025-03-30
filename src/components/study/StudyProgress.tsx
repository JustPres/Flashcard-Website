'use client';

import { useEffect, useState } from 'react';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';

interface StudyProgressProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  timeElapsed: number;
  onFinish: () => void;
}

export default function StudyProgress({
  currentIndex,
  totalCards,
  correctCount,
  incorrectCount,
  timeElapsed,
  onFinish
}: StudyProgressProps) {
  const [formattedTime, setFormattedTime] = useState('00:00');
  
  // Calculate progress percentage
  const progressPercentage = totalCards > 0 ? Math.round((currentIndex / totalCards) * 100) : 0;
  
  // Format time elapsed
  useEffect(() => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    setFormattedTime(`${formattedMinutes}:${formattedSeconds}`);
  }, [timeElapsed]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Progress bar and count */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress: {currentIndex} of {totalCards}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Study stats */}
        <div className="flex space-x-4">
          {/* Time */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formattedTime}</span>
          </div>
          
          {/* Correct count */}
          <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">{correctCount}</span>
          </div>
          
          {/* Incorrect count */}
          <div className="flex items-center bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">{incorrectCount}</span>
          </div>
        </div>
        
        {/* Finish early button */}
        <button
          onClick={onFinish}
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          Finish
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 