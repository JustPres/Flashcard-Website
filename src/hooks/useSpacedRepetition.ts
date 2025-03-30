import { useState, useCallback } from 'react';
import { Flashcard } from '@/types';

/**
 * Custom hook for implementing the SM-2 spaced repetition algorithm
 */
export function useSpacedRepetition() {
  // The quality of recall ratings: 0-5 (0=worst, 5=perfect)
  const [qualityRatings] = useState([
    { value: 0, label: 'Complete blackout', description: 'Total failure to recall' },
    { value: 1, label: 'Incorrect', description: 'Wrong answer, but recognized the correct answer' },
    { value: 2, label: 'Almost', description: 'Wrong answer, but close to correct' },
    { value: 3, label: 'Difficult', description: 'Correct answer, but required a significant effort' },
    { value: 4, label: 'Correct', description: 'Correct answer after some hesitation' },
    { value: 5, label: 'Perfect', description: 'Perfect answer with no hesitation' }
  ]);
  
  /**
   * Calculate the next review date using the SM-2 algorithm
   * @param card The flashcard being reviewed
   * @param quality The quality of recall (0-5)
   * @returns Object with updated spaced repetition data
   */
  const calculateNextReview = useCallback((card: Flashcard, quality: number) => {
    // Initialize values from card or set defaults
    let repetitions = card.repetitions || 0;
    let easeFactor = card.easeFactor || 2.5;
    let interval = card.interval || 1;
    
    if (quality < 3) {
      // If recall was difficult (quality < 3), reset repetitions
      repetitions = 0;
      interval = 1;
    } else {
      // If recall was successful (quality >= 3), increment repetitions
      repetitions += 1;
      
      // Calculate new interval based on repetition count
      if (repetitions === 1) {
        interval = 1; // 1 day
      } else if (repetitions === 2) {
        interval = 6; // 6 days
      } else {
        // For 3+ repetitions, multiply the previous interval by the ease factor
        interval = Math.round(interval * easeFactor);
      }
      
      // Update ease factor based on quality of recall
      // The formula is EF' := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    }
    
    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    
    return {
      repetitions,
      easeFactor,
      interval,
      nextReview,
      lastReviewed: new Date()
    };
  }, []);
  
  /**
   * Get cards due for review
   * @param cards Array of flashcards
   * @returns Array of cards that are due for review
   */
  const getDueCards = useCallback((cards: Flashcard[]) => {
    const now = new Date();
    return cards.filter(card => 
      !card.nextReview || new Date(card.nextReview) <= now
    );
  }, []);
  
  // Return the hook's functions and state
  return {
    qualityRatings,
    calculateNextReview,
    getDueCards
  };
} 