'use client';

import { useState, useEffect } from 'react';
import { Flashcard, Category, Tag } from '@/types';
import { motion } from 'framer-motion';

interface FlashcardItemProps {
  card: Flashcard;
  isExpanded: boolean;
  onClick: () => void;
  category?: Category;
  tags: Tag[];
}

export default function FlashcardItem({
  card,
  isExpanded,
  onClick,
  category,
  tags
}: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Reset flip when changing cards
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);
  
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div 
      className="relative w-full h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="card-container h-full">
        <motion.div 
          className={`card ${isFlipped ? 'flipped' : ''}`}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
        >
          {/* Front of card */}
          <div className="card-face bg-white dark:bg-gray-800 p-4 flex flex-col">
            {category && (
              <div 
                className="text-xs font-medium px-2 py-1 rounded-full w-fit"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.icon} {category.name}
              </div>
            )}
            
            <div className="mt-2 flex-grow overflow-auto">
              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {card.front}
              </p>
              
              {card.mediaFront && card.mediaFront.length > 0 && (
                <div className="mt-3">
                  {card.mediaFront.map(media => (
                    <div key={media.id} className="rounded-md overflow-hidden">
                      {media.type === 'image' && (
                        <img 
                          src={media.url} 
                          alt={media.caption || 'Image'} 
                          className="w-full h-20 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map(tag => (
                  <span 
                    key={tag.id}
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleFlip}
                className="p-1.5 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors text-sm"
              >
                Flip
              </button>
            </div>
          </div>
          
          {/* Back of card */}
          <div className="card-face card-back bg-white dark:bg-gray-800 p-4 flex flex-col">
            <div className="flex-grow overflow-auto">
              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {card.back}
              </p>
              
              {card.mediaBack && card.mediaBack.length > 0 && (
                <div className="mt-3">
                  {card.mediaBack.map(media => (
                    <div key={media.id} className="rounded-md overflow-hidden">
                      {media.type === 'image' && (
                        <img 
                          src={media.url} 
                          alt={media.caption || 'Image'} 
                          className="w-full h-20 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last reviewed: {formatDate(card.lastReviewed)}
              </div>
              
              <button
                onClick={handleFlip}
                className="p-1.5 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors text-sm"
              >
                Flip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 