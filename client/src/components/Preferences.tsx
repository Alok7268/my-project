import React from 'react';

type Category = {
  id: string;
  name: string;
  icon: string;
};

type PreferencesProps = {
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
}

export function Preferences({ selectedCategories, onToggleCategory }: PreferencesProps) {
  const categories: Category[] = [
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">News Preferences</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
                selectedCategories.includes(category.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}