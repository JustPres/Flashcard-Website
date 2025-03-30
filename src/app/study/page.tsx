'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Flashcard, Category, Tag } from '@/types';
import StudyCard from '@/components/StudyCard';
import StudyProgress from '@/components/study/StudyProgress';
import StudyComplete from '@/components/study/StudyComplete';
import { v4 as uuidv4 } from 'uuid';
import { useStudySession } from '@/hooks/useStudySession';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

export default function StudyPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studySession, setStudySession] = useState({
    id: uuidv4(),
    startTime: new Date(),
    cardsStudied: 0,
    correctAnswers: 0,
    incorrectCount: 0,
    duration: 0,
  });
  const [studyComplete, setStudyComplete] = useState(false);
  const [studyMode, setStudyMode] = useState<'spaced' | 'random' | 'sequential'>('spaced');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { calculateNextReview } = useSpacedRepetition();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (!studyComplete) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [studyComplete]);

  // Load data
  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards');
    const savedCategories = localStorage.getItem('categories');
    const savedTags = localStorage.getItem('tags');
    
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      
      // Sort cards by nextReview date for spaced repetition
      if (studyMode === 'spaced') {
        const now = new Date();
        const dueCards = parsedCards.filter((card: Flashcard) => 
          !card.nextReview || new Date(card.nextReview) <= now
        );
        setCards(dueCards.sort((a: Flashcard, b: Flashcard) => {
          if (!a.nextReview) return -1;
          if (!b.nextReview) return 1;
          return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
        }));
      } else if (studyMode === 'random') {
        // Shuffle cards for random mode
        setCards([...parsedCards].sort(() => Math.random() - 0.5));
      } else {
        // Sequential mode - use cards as is
        setCards(parsedCards);
      }
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, [studyMode]);

  const handleAnswer = (quality: number) => {
    if (currentCardIndex >= cards.length) {
      return;
    }
    
    const currentCard = cards[currentCardIndex];
    
    // Update card with spaced repetition data
    const updatedCard = {
      ...currentCard,
      ...calculateNextReview(currentCard, quality),
    };
    
    // Update card in localStorage
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      const allCards = JSON.parse(savedCards);
      const updatedCards = allCards.map((card: Flashcard) => 
        card.id === updatedCard.id ? updatedCard : card
      );
      localStorage.setItem('flashcards', JSON.stringify(updatedCards));
    }
    
    // Update study session stats
    setStudySession(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (quality >= 3 ? 1 : 0),
      incorrectCount: prev.incorrectCount + (quality < 3 ? 1 : 0),
      duration: timeElapsed
    }));
    
    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of study session
      completeStudySession();
    }
  };

  const completeStudySession = () => {
    // Complete session
    const completedSession = {
      ...studySession,
      duration: timeElapsed,
    };
    
    // Save session to localStorage
    const savedSessions = localStorage.getItem('studySessions');
    const sessions = savedSessions ? JSON.parse(savedSessions) : [];
    
    // Create a properly formatted StudySession object
    const newSession = {
      id: completedSession.id,
      date: new Date(),
      duration: completedSession.duration,
      cardsStudied: completedSession.cardsStudied,
      correctAnswers: completedSession.correctAnswers,
      incorrectAnswers: completedSession.incorrectCount,
      cardDetails: [], // We don't track this in the current implementation
    };
    
    sessions.push(newSession);
    localStorage.setItem('studySessions', JSON.stringify(sessions));
    
    // Mark as complete
    setStudyComplete(true);
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setStudyComplete(false);
    setTimeElapsed(0);
    setStudySession({
      id: uuidv4(),
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      incorrectCount: 0,
      duration: 0,
    });
  };

  const handleFinishEarly = () => {
    completeStudySession();
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };
  
  const getTagsForCard = (tagIds: string[]): Tag[] => {
    return tags.filter(tag => tagIds.includes(tag.id));
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No cards to study</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create some flashcards or wait until your cards are due for review.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Study Mode</h1>
          
          <div className="flex space-x-2">
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value as 'spaced' | 'random' | 'sequential')}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              aria-label="Select study mode"
            >
              <option value="spaced">Spaced Repetition</option>
              <option value="random">Random</option>
              <option value="sequential">Sequential</option>
            </select>
            
            <button
              onClick={restartStudy}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Restart
            </button>
          </div>
        </div>
        
        {!studyComplete ? (
          <>
            <StudyProgress 
              currentIndex={currentCardIndex + 1}
              totalCards={cards.length}
              correctCount={studySession.correctAnswers}
              incorrectCount={studySession.incorrectCount}
              timeElapsed={timeElapsed}
              onFinish={handleFinishEarly}
            />
            
            {cards[currentCardIndex] && (
              <div className="mt-8 flex justify-center">
                <div className="w-full max-w-2xl">
                  <StudyCard 
                    card={cards[currentCardIndex]}
                    category={getCategoryById(cards[currentCardIndex].categoryId)}
                    tags={getTagsForCard(cards[currentCardIndex].tagIds)}
                    onAnswer={handleAnswer}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <StudyComplete 
            duration={studySession.duration}
            cardsStudied={studySession.cardsStudied}
            correctCount={studySession.correctAnswers}
            incorrectCount={studySession.incorrectCount}
          />
        )}
      </div>
    </div>
  );
} 