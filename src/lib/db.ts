import { Flashcard, Category, Tag, StudySession, UserPreferences } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Science', description: 'Scientific concepts and facts', color: '#3b82f6', icon: '🔬' },
  { id: '2', name: 'History', description: 'Historical events and figures', color: '#ef4444', icon: '📜' },
  { id: '3', name: 'Languages', description: 'Vocabulary and grammar', color: '#10b981', icon: '🗣️' },
  { id: '4', name: 'Math', description: 'Mathematical concepts and formulas', color: '#f59e0b', icon: '🧮' },
];

// Default tags
const defaultTags: Tag[] = [
  { id: '1', name: 'Important', color: '#ef4444' },
  { id: '2', name: 'Review', color: '#f59e0b' },
  { id: '3', name: 'Easy', color: '#10b981' },
  { id: '4', name: 'Hard', color: '#6366f1' },
];

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  cardDisplaySize: 'medium',
  showImages: true,
  autoPlayMedia: false,
  reviewOrder: 'spaced',
};

// Initialize database with sample data if empty
export const initializeDb = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize categories
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }
  
  // Initialize tags
  if (!localStorage.getItem('tags')) {
    localStorage.setItem('tags', JSON.stringify(defaultTags));
  }
  
  // Initialize user preferences
  if (!localStorage.getItem('userPreferences')) {
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
  }
  
  // Initialize empty arrays if they don't exist
  if (!localStorage.getItem('flashcards')) {
    localStorage.setItem('flashcards', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('studySessions')) {
    localStorage.setItem('studySessions', JSON.stringify([]));
  }
};

// Get all flashcards
export const getFlashcards = (): Flashcard[] => {
  if (typeof window === 'undefined') return [];
  
  const cards = localStorage.getItem('flashcards');
  return cards ? JSON.parse(cards) : [];
};

// Save a flashcard
export const saveFlashcard = (card: Flashcard): Flashcard => {
  if (typeof window === 'undefined') return card;
  
  const cards = getFlashcards();
  
  if (card.id) {
    // Update existing card
    const updatedCards = cards.map(c => c.id === card.id ? { ...card, updatedAt: new Date() } : c);
    localStorage.setItem('flashcards', JSON.stringify(updatedCards));
  } else {
    // Create new card
    const newCard = {
      ...card,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
    };
    localStorage.setItem('flashcards', JSON.stringify([...cards, newCard]));
    return newCard;
  }
  
  return card;
};

// Delete a flashcard
export const deleteFlashcard = (cardId: string): void => {
  if (typeof window === 'undefined') return;
  
  const cards = getFlashcards();
  const updatedCards = cards.filter(card => card.id !== cardId);
  localStorage.setItem('flashcards', JSON.stringify(updatedCards));
};

// Get all categories
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return defaultCategories;
  
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : defaultCategories;
};

// Get all tags
export const getTags = (): Tag[] => {
  if (typeof window === 'undefined') return defaultTags;
  
  const tags = localStorage.getItem('tags');
  return tags ? JSON.parse(tags) : defaultTags;
};

// Get user preferences
export const getUserPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return defaultPreferences;
  
  const prefs = localStorage.getItem('userPreferences');
  return prefs ? JSON.parse(prefs) : defaultPreferences;
};

// Save user preferences
export const saveUserPreferences = (preferences: UserPreferences): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

// Save study session
export const saveStudySession = (session: StudySession): void => {
  if (typeof window === 'undefined') return;
  
  const savedSessions = localStorage.getItem('studySessions');
  const sessions = savedSessions ? JSON.parse(savedSessions) : [];
  sessions.push(session);
  localStorage.setItem('studySessions', JSON.stringify(sessions));
}; 