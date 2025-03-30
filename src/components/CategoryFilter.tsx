'use client';

import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <button
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
          !selectedCategory
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1 ${
            selectedCategory === category.id
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          <span>{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
} 