'use client';

import { useEffect, useRef } from 'react';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

interface StudyCompleteProps {
  duration: number;
  cardsStudied: number;
  correctCount: number;
  incorrectCount: number;
}

export default function StudyComplete({ 
  duration, 
  cardsStudied,
  correctCount,
  incorrectCount 
}: StudyCompleteProps) {
  const router = useRouter();
  const confettiRef = useRef<HTMLDivElement>(null);
  
  // Format duration to mm:ss
  const formatDuration = () => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };
  
  // Calculate accuracy percentage
  const accuracy = cardsStudied > 0 
    ? Math.round((correctCount / cardsStudied) * 100) 
    : 0;
  
  // Trigger confetti animation on component mount
  useEffect(() => {
    if (accuracy >= 70 && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Convert to normalized coordinates
      const normalizedX = x / window.innerWidth;
      const normalizedY = y / window.innerHeight;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: normalizedX, y: normalizedY }
      });
    }
  }, [accuracy]);
  
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <div ref={confettiRef} className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Complete!</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Great job on completing your study session!
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Time studied */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <ClockIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Time</h3>
          </div>
          <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{formatDuration()}</p>
        </div>
        
        {/* Cards studied */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Cards</h3>
          </div>
          <p className="text-xl font-bold text-purple-800 dark:text-purple-200">{cardsStudied}</p>
        </div>
      </div>
      
      {/* Accuracy chart */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accuracy</h3>
        
        <div className="flex items-center">
          <div className="flex-1 mr-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div 
                className={`h-4 rounded-full ${
                  accuracy >= 80 ? 'bg-green-500' : 
                  accuracy >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white">{accuracy}%</span>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            <span>Correct: {correctCount}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
            <span>Incorrect: {incorrectCount}</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col space-y-2">
        <button 
          onClick={() => router.push('/study')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          Study Again
          <ChevronRightIcon className="ml-1 h-5 w-5" />
        </button>
        
        <button 
          onClick={() => router.push('/statistics')}
          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          View Statistics
        </button>
      </div>
    </div>
  );
} 