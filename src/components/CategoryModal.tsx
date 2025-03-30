'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Category } from '@/types';

const EMOJI_OPTIONS = [
  '🔬', '📚', '🧮', '🖌️', '🎵', '🌍', '💻', '📊', '🧠', '📜',
  '🏛️', '⚖️', '💬', '🔤', '🌱', '🧪', '🔢', '🎨', '🎭', '📱',
  '🏃', '🍎', '🐶', '✈️', '🚗', '🏠', '🏆', '💼', '🔨', '🎮'
];

const COLOR_OPTIONS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
];

interface CategoryModalProps {
  category: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

export default function CategoryModal({ 
  category, 
  onSave, 
  onCancel 
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🔬');
  const [color, setColor] = useState('#3b82f6');
  
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setIcon(category.icon || '🔬');
      setColor(category.color || '#3b82f6');
    }
  }, [category]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCategory: Category = {
      id: category?.id || '',
      name,
      description: description || undefined,
      icon,
      color,
    };
    
    onSave(updatedCategory);
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
          
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  {category ? 'Edit Category' : 'Create New Category'}
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Category name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Brief description of this category"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-10 gap-2">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setIcon(emoji)}
                          className={`p-2 text-xl rounded-md ${
                            icon === emoji 
                              ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 dark:border-primary-400' 
                              : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'
                          }`}
                          aria-label={`Select ${emoji} icon`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((colorOption) => (
                        <button
                          key={colorOption}
                          type="button"
                          onClick={() => setColor(colorOption)}
                          className={`h-8 w-8 rounded-full border-2 ${
                            color === colorOption ? 'border-gray-800 dark:border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: colorOption }}
                          aria-label={`Select color ${colorOption}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div 
                      className="flex items-center p-2 rounded-md"
                      style={{ backgroundColor: `${color}20`, color: color }}
                    >
                      <span className="text-xl mr-2">{icon}</span>
                      <span className="font-medium">Preview</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 