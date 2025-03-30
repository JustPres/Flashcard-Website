'use client';

import { useState } from 'react';
import { Flashcard, Category, Tag } from '@/types';
import FlashcardItem from './FlashcardItem';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FlashcardGridProps {
  cards: Flashcard[];
  categories: Category[];
  tags: Tag[];
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function FlashcardGrid({ 
  cards, 
  categories, 
  tags, 
  onEditCard, 
  onDeleteCard 
}: FlashcardGridProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Helper function to find category by id
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };
  
  // Helper function to get tags for a card
  const getTagsForCard = (cardTags: string[]): Tag[] => {
    return tags.filter(tag => cardTags.includes(tag.id));
  };
  
  const handleCardClick = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };
  
  if (cards.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No flashcards found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first flashcard using the button above.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map(card => (
        <div 
          key={card.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-60"
        >
          <FlashcardItem 
            card={card}
            isExpanded={expandedCardId === card.id}
            onClick={() => handleCardClick(card.id)}
            category={getCategoryById(card.category)}
            tags={getTagsForCard(card.tags)}
          />
          
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditCard(card);
              }}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              aria-label="Edit card"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this flashcard?')) {
                  onDeleteCard(card.id);
                }
              }}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Delete card"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 