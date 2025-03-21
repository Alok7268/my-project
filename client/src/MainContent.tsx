import React, { useState, useEffect } from 'react';
import { ArticleCard } from './components/ArticleCard';
import { Preferences } from './components/Preferences';
import { Sidebar } from './components/Sidebar';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isRead: boolean;
  isSaved: boolean;
  categories: string[];
}

function MainContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'preferences'>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Moved `fetchArticles` outside to avoid scoping issues
  const fetchArticles = async (selectedCategories: string[]) => {
    try {
      setLoading(true); // Added to ensure loading state resets
      const query = selectedCategories.length
        ? selectedCategories.join(',')
        : '';

      const response = await fetch(`http://192.168.1.12:3001/api/news?categories=${query}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const formattedArticles: Article[] = data.articles.map((article: any) => ({
        id: article.url,
        title: article.title,
        summary: article.description,
        imageUrl: article.urlToImage,
        sentiment: 'neutral',
        isRead: false,
        isSaved: false,
        categories: article.source ? [article.source.name] : [],
      }));

      setArticles(formattedArticles);
      setError(null); // Clear error state on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(selectedCategories); // Corrected: Now sends `selectedCategories` in initial fetch too
  }, [selectedCategories]);

  const handleToggleRead = (id: string) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, isRead: !article.isRead } : article
      )
    );
  };

  const handleToggleSave = (id: string) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, isSaved: !article.isSaved } : article
      )
    );
  };

  const handleToggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const renderContent = () => {
    if (loading) return <div>Loading articles...</div>;
    if (error) return <div>Error: {error}</div>;

    switch (activeTab) {
      case 'home':
        return articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onToggleRead={handleToggleRead}
            onToggleSave={handleToggleSave}
            onShare={() => {}}
          />
        ));
      case 'saved':
        return articles
          .filter((article) => article.isSaved)
          .map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggleRead={handleToggleRead}
              onToggleSave={handleToggleSave}
              onShare={() => {}}
            />
          ));
      case 'preferences':
        return <Preferences selectedCategories={selectedCategories} onToggleCategory={handleToggleCategory} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default MainContent;
