export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  tagIds: string[];
  image?: string;
  audio?: string;
  createdAt: Date;
  updatedAt: Date;
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
  nextReview?: Date;
  lastReviewed?: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  caption?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface QuizResult {
  id: string;
  date: Date;
  correctAnswers: number;
  totalCards: number;
  timeSpent: number; // in seconds
  flashcardIds: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  cardDisplaySize: 'small' | 'medium' | 'large';
  showImages: boolean;
  autoPlayMedia: boolean;
  reviewOrder: 'random' | 'newest' | 'oldest' | 'spaced';
}

export interface StudySession {
  id: string;
  date: Date;
  duration: number; // in seconds
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  cardDetails: {
    cardId: string;
    quality: number;
  }[];
}

export enum StudyMode {
  Flashcards = 'flashcards',
  Quiz = 'quiz',
  Match = 'match',
}

export interface QualityRating {
  value: number;
  label: string;
  description: string;
} 