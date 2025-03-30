'use client';

import { useState, useEffect } from 'react';
import { Flashcard, Category, Tag } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CardModalProps {
  card: Flashcard | null;
  categories: Category[];
  tags: Tag[];
  onSave: (card: Flashcard) => void;
  onCancel: () => void;
}

export default function CardModal({
  card,
  categories,
  tags,
  onSave,
  onCancel
}: CardModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
      setCategory(card.category);
      setSelectedTags(card.tags);
    } else {
      // Default category if creating a new card
      setCategory(categories[0]?.id || '');
    }
  }, [card, categories]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCard: Flashcard = {
      ...card,
      id: card?.id || '',
      front,
      back,
      category,
      tags: selectedTags,
      easeFactor: card?.easeFactor || 2.5,
      interval: card?.interval || 1,
      repetitions: card?.repetitions || 0,
      createdAt: card?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(updatedCard);
  };
  
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onCancel}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              onClick={onCancel}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                {card ? 'Edit Card' : 'Create New Card'}
              </h3>
              
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="front" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Front
                  </label>
                  <textarea
                    id="front"
                    required
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Type the question or front side of the card..."
                  />
                </div>
                
                <div>
                  <label htmlFor="back" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Back
                  </label>
                  <textarea
                    id="back"
                    required
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Type the answer or back side of the card..."
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTags.includes(tag.id)
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border-2 border-primary-500'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-2 border-transparent'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 