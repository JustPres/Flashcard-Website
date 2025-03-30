'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import CategoryModal from '@/components/CategoryModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  // Load categories
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Sample categories if none exist
      const sampleCategories = [
        { id: '1', name: 'Science', description: 'Scientific concepts and facts', color: '#3b82f6', icon: '🔬' },
        { id: '2', name: 'History', description: 'Historical events and figures', color: '#ef4444', icon: '📜' },
        { id: '3', name: 'Languages', description: 'Vocabulary and grammar', color: '#10b981', icon: '🗣️' },
        { id: '4', name: 'Math', description: 'Mathematical concepts and formulas', color: '#f59e0b', icon: '🧮' },
      ];
      
      setCategories(sampleCategories);
      localStorage.setItem('categories', JSON.stringify(sampleCategories));
    }
  }, []);
  
  // Handle category operations
  const handleCreateCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // Check if any cards are using this category
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      const cards = JSON.parse(savedCards);
      const cardsInCategory = cards.filter((card: any) => card.category === categoryId);
      
      if (cardsInCategory.length > 0) {
        if (!confirm(`This category contains ${cardsInCategory.length} flashcards. Deleting it will affect these cards. Do you want to continue?`)) {
          return;
        }
      }
    }
    
    // Delete category
    const updatedCategories = categories.filter(category => category.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };
  
  const handleSaveCategory = (category: Category) => {
    let updatedCategories;
    
    if (category.id) {
      // Edit existing category
      updatedCategories = categories.map(c => c.id === category.id ? category : c);
    } else {
      // Create new category
      const newCategory = {
        ...category,
        id: uuidv4(),
      };
      updatedCategories = [...categories, newCategory];
    }
    
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setIsModalOpen(false);
  };
  
  // Get card count for each category
  const getCategoryCardCount = (categoryId: string): number => {
    const savedCards = localStorage.getItem('flashcards');
    if (!savedCards) return 0;
    
    const cards = JSON.parse(savedCards);
    return cards.filter((card: any) => card.category === categoryId).length;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Categories</h1>
          
          <button
            onClick={handleCreateCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Category
          </button>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {categories.map(category => (
            <div 
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <span 
                    className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.icon}
                  </span>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getCategoryCardCount(category.id)} cards
                    </p>
                  </div>
                </div>
                
                {category.description && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                )}
                
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    aria-label={`Edit ${category.name} category`}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    aria-label={`Delete ${category.name} category`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category Modal */}
      {isModalOpen && (
        <CategoryModal
          category={currentCategory}
          onSave={handleSaveCategory}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
} 