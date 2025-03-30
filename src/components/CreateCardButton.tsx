'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateCardButtonProps {
  onClick: () => void;
}

export default function CreateCardButton({ onClick }: CreateCardButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Create Card
    </button>
  );
} 