'use client';

import { useState, useEffect } from 'react';
import StatsOverview from '@/components/statistics/StatsOverview';
import { StudySession } from '@/types';

export default function StatisticsPage() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load study sessions from localStorage
    const loadSessions = () => {
      if (typeof window === 'undefined') return [];
      
      try {
        const sessionsData = localStorage.getItem('studySessions');
        const sessions = sessionsData ? JSON.parse(sessionsData) : [];
        return sessions;
      } catch (error) {
        console.error('Error loading study sessions:', error);
        return [];
      }
    };
    
    setStudySessions(loadSessions());
    setIsLoading(false);
  }, []);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Study Statistics</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <StatsOverview sessions={studySessions} />
          
          {studySessions.length > 0 ? (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Study Sessions</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                  <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Date</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Cards Studied</th>
                      <th className="px-4 py-3">Correct</th>
                      <th className="px-4 py-3 rounded-tr-lg">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studySessions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((session) => {
                        const accuracy = Math.round((session.correctAnswers / session.cardsStudied) * 100);
                        const date = new Date(session.date);
                        const formattedDate = new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(date);
                        
                        const minutes = Math.floor(session.duration / 60);
                        const seconds = session.duration % 60;
                        const duration = `${minutes}m ${seconds}s`;
                        
                        return (
                          <tr key={session.id} className="border-b dark:border-gray-700">
                            <td className="px-4 py-3">{formattedDate}</td>
                            <td className="px-4 py-3">{duration}</td>
                            <td className="px-4 py-3">{session.cardsStudied}</td>
                            <td className="px-4 py-3">{session.correctAnswers}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                accuracy >= 80 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : accuracy >= 60 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {accuracy}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No study history yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start studying to track your progress and see detailed statistics.</p>
              <a href="/study" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Start Studying
              </a>
            </div>
          )}
        </>
      )}
    </main>
  );
} 