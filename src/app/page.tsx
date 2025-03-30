'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { initializeDb } from '@/lib/db';
import { Flashcard, Category } from '@/types';

export default function Home() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize database with default data if needed
    initializeDb();
    
    // Load data
    const loadData = () => {
      const savedCards = localStorage.getItem('flashcards');
      const savedCategories = localStorage.getItem('categories');
      
      const parsedCards = savedCards ? JSON.parse(savedCards) : [];
      const parsedCategories = savedCategories ? JSON.parse(savedCategories) : [];
      
      setCards(parsedCards);
      setCategories(parsedCategories);
      
      // Find due cards (for today)
      const now = new Date();
      const due = parsedCards.filter((card: Flashcard) => 
        !card.nextReview || new Date(card.nextReview) <= now
      );
      setDueCards(due);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to FlashMaster
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            A powerful flashcard app with spaced repetition
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Today's cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Today's Review
              </h2>
              
              {dueCards.length > 0 ? (
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You have <span className="font-semibold text-blue-600 dark:text-blue-400">{dueCards.length}</span> cards due for review today.
                  </p>
                  
                  <Link 
                    href="/study"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Start Studying
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <p>All caught up! No cards due for review.</p>
                </div>
              )}
            </div>
            
            {/* Card Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Your Progress
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Cards</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{cards.length}</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Categories</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">{categories.length}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  href="/statistics"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  View detailed statistics →
                </Link>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link 
                  href="/create"
                  className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-white">Create New Card</span>
                  <span className="text-gray-500 dark:text-gray-400">+</span>
                </Link>
                
                <Link 
                  href="/categories"
                  className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-white">Manage Categories</span>
                  <span className="text-gray-500 dark:text-gray-400">→</span>
                </Link>
                
                <Link 
                  href="/settings"
                  className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-white">Settings</span>
                  <span className="text-gray-500 dark:text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 