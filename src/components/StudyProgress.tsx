'use client';

interface StudyProgressProps {
  current: number;
  total: number;
  correct: number;
}

export default function StudyProgress({ current, total, correct }: StudyProgressProps) {
  const progress = (current - 1) / total * 100;
  const correctPercentage = total === 0 ? 0 : ((correct / (current - 1)) * 100) || 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress: {current - 1} of {total} cards
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {current > 1 && (
        <>
          <div className="flex items-center justify-between mt-4 mb-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Accuracy: {correct} correct of {current - 1} cards
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(correctPercentage)}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                correctPercentage >= 80 ? 'bg-green-500' : 
                correctPercentage >= 50 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${correctPercentage}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
} 