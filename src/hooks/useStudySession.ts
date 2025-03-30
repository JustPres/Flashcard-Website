import { useState, useEffect, useCallback } from 'react';
import { Flashcard, StudySession } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useSpacedRepetition } from './useSpacedRepetition';

interface StudySessionState {
  isActive: boolean;
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  timeElapsed: number;
  isComplete: boolean;
  cardResponses: { cardId: string; quality: number }[];
}

export function useStudySession(cards: Flashcard[]) {
  const [session, setSession] = useState<StudySessionState>({
    isActive: false,
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    timeElapsed: 0,
    isComplete: false,
    cardResponses: [],
  });
  
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const { calculateNextReview } = useSpacedRepetition();
  
  // Start the study session
  const startSession = useCallback(() => {
    setSession({
      isActive: true,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      timeElapsed: 0,
      isComplete: false,
      cardResponses: [],
    });
    
    // Start the timer
    const interval = setInterval(() => {
      setSession((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);
    
    setTimerInterval(interval);
  }, []);
  
  // Record the answer to the current card
  const recordAnswer = useCallback((card: Flashcard, isCorrect: boolean, quality: number) => {
    setSession((prev) => {
      // Check if we've reached the end of the cards
      const isLastCard = prev.currentIndex >= cards.length - 1;
      const newCardResponses = [
        ...prev.cardResponses,
        { cardId: card.id, quality }
      ];
      
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        incorrectCount: !isCorrect ? prev.incorrectCount + 1 : prev.incorrectCount,
        isComplete: isLastCard,
        cardResponses: newCardResponses,
      };
    });
    
    // Update flashcard with spaced repetition data
    return calculateNextReview(card, quality);
  }, [cards.length, calculateNextReview]);
  
  // End the study session
  const endSession = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setSession((prev) => ({
      ...prev,
      isActive: false,
      isComplete: true,
    }));
    
    // Save study session data to localStorage
    const newSession: StudySession = {
      id: uuidv4(),
      date: new Date(),
      duration: session.timeElapsed,
      cardsStudied: session.currentIndex,
      correctAnswers: session.correctCount,
      incorrectAnswers: session.incorrectCount,
      cardDetails: session.cardResponses,
    };
    
    if (typeof window !== 'undefined') {
      try {
        // Get existing sessions
        const existingSessions = localStorage.getItem('studySessions');
        const sessions = existingSessions ? JSON.parse(existingSessions) : [];
        
        // Add new session
        localStorage.setItem('studySessions', JSON.stringify([...sessions, newSession]));
      } catch (error) {
        console.error('Error saving study session:', error);
      }
    }
    
    return newSession;
  }, [session.correctCount, session.currentIndex, session.incorrectCount, session.timeElapsed, session.cardResponses, timerInterval]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  return {
    session,
    startSession,
    recordAnswer,
    endSession
  };
} 