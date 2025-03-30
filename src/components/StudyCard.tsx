'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard, Category, Tag } from '@/types';

interface StudyCardProps {
  card: Flashcard;
  category?: Category;
  tags: Tag[];
  onAnswer: (quality: number) => void;
}

export default function StudyCard({ card, category, tags, onAnswer }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRating, setShowRating] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // When flipping to answer, show rating
      setShowRating(true);
    }
  };
  
  const handleRating = (quality: number) => {
    onAnswer(quality);
    setIsFlipped(false);
    setShowRating(false);
  };
  
  return (
    <div className="relative">
      <div 
        className="relative w-full perspective-1000 h-64 cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div 
            className={`absolute w-full h-full backface-hidden rounded-lg p-6 shadow-lg
                      ${isFlipped ? 'hidden' : 'bg-white dark:bg-gray-800'}`}
          >
            <div className="flex items-center justify-between mb-4">
              {category && (
                <span 
                  className="text-xs px-2 py-1 rounded-full" 
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.icon} {category.name}
                </span>
              )}
              <div className="flex gap-1">
                {tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {card.question}
                </h3>
                {card.image && (
                  <img 
                    src={card.image} 
                    alt="Question visual" 
                    className="max-h-24 mx-auto mt-3"
                  />
                )}
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Tap to reveal answer
            </div>
          </div>
          
          {/* Back */}
          <div 
            className={`absolute w-full h-full backface-hidden rounded-lg p-6 shadow-lg bg-white dark:bg-gray-800
                      rotateY-180`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  {card.answer}
                </h3>
                {card.audio && (
                  <audio controls className="mx-auto mt-3">
                    <source src={card.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Rating buttons - shown only after flipping */}
      {showRating && (
        <div className="mt-6">
          <div className="text-center mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            How well did you know this?
          </div>
          <div className="flex justify-between gap-2">
            <button 
              onClick={() => handleRating(0)}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
            >
              Not at all
            </button>
            <button 
              onClick={() => handleRating(3)}
              className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
            >
              With effort
            </button>
            <button 
              onClick={() => handleRating(5)}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
            >
              Perfectly
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 