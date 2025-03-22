import React from 'react';
import { Bookmark, Share2, CheckCircle, Smile, Meh, Frown } from 'lucide-react';

type ArticleProps = {
  article: {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    url: string;
    sentiment: string;
    isRead: boolean;
    isSaved: boolean;
    categories: readonly string[];
  };
  onToggleRead: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (id: string) => void;
};

export function ArticleCard({
  article: { id, title, summary, imageUrl, url, sentiment, isRead, isSaved, categories },
  onToggleRead,
  onToggleSave,
  onShare,
}: ArticleProps) {

  const sentimentColors = {
    positive: 'bg-green-100 text-green-800 border-green-400',
    neutral: 'bg-gray-100 text-gray-800 border-gray-400',
    negative: 'bg-red-100 text-red-800 border-red-400',
  };

  const sentimentIcons = {
    positive: <Smile size={16} className="inline-block mr-1" />,
    neutral: <Meh size={16} className="inline-block mr-1" />,
    negative: <Frown size={16} className="inline-block mr-1" />,
  };

  return (
    <div
      key={id}
      className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 transition-all border-l-4 ${
        sentimentColors[sentiment as keyof typeof sentimentColors] || ''
      } ${isRead ? 'opacity-75' : 'hover:shadow-lg'}`}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
      </a>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-sm px-2 py-1 rounded-full font-medium flex items-center ${sentimentColors[sentiment as keyof typeof sentimentColors] || ''}`}
            >
              {sentimentIcons[sentiment as keyof typeof sentimentIcons]} {sentiment}
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleRead(id);
              }}
              title={isRead ? 'Mark as Unread' : 'Mark as Read'}
              className={`p-2 rounded-full ${
                isRead ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
              } transition-colors`}
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSave(id);
              }}
              title={isSaved ? 'Unsave Article' : 'Save Article'}
              className={`p-2 rounded-full ${
                isSaved ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
              } transition-colors`}
            >
              <Bookmark size={20} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onShare(id);
              }}
              title="Share Article"
              className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{summary}</p>
      </div>
    </div>
  );
}
