import React, { useState, useEffect } from 'react';
import { ArticleCard } from './components/ArticleCard';
import { Preferences } from './components/Preferences';
import { Sidebar } from './components/Sidebar';
import { useUserData } from '@nhost/react';
import { nhost } from '../src/App';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isRead: boolean;
  isSaved: boolean;
  categories: string[];
}

function MainContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'preferences' | 'personalized'>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useUserData();

  const fetchUserPreferences = async () => {
    if (!user) return;

    const { data, error } = await nhost.graphql.request(`
      query GetUserPreferences {
        preferences(where: { user_id: { _eq: "${user.id}" } }) {
          topic
        }
      }
    `);

    if (error) {
      console.error('Failed to fetch preferences:', error);
      return;
    }

    if (data?.preferences?.[0]?.topic) {
      setSelectedCategories(data.preferences[0].topic);
    } else {
      // Insert new preferences if none exist
      await nhost.graphql.request(`
        mutation InsertUserPreferences {
          insert_preferences_one(object: {
            user_id: "${user.id}",
            topic: []
          }) {
            id
          }
        }
      `);
    }
  };

  const updateUserPreferences = async (categories: string[]) => {
    if (!user) return;

    const headers = {
      'X-Hasura-Role': 'user', // or whatever role is needed
    };

    const mutation = `
      mutation UpdateUserPreferences($display_name: String!, $topic: [String!]) {
        insert_preferences_one(
          object: {
            display_name: $display_name
            topic: $topic
          }
          on_conflict: {
            constraint: preferences_pkey
            update_columns: [topic]
          }
        ) {
          display_name
          topic
        }
      }
    `;

    const { error, data } = await nhost.graphql.request(mutation, {
      display_name: user.displayName,
      topic: categories
    }, { headers });

    if (error) {
      console.error('Failed to update preferences:', error);
    } else {
      console.log('Updated Preferences:', data);
    }
  };

  useEffect(() => {
    if (user) fetchUserPreferences();
  }, [user]);

  const fetchArticles = async (selectedCategories: string[]) => {
    try {
      setLoading(true);
      const query = selectedCategories.length ? selectedCategories.join(',') : '';

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
        url: article.url,
        sentiment: 'neutral',
        isRead: false,
        isSaved: false,
        categories: article.source ? [article.source.name] : [],
      }));

      setArticles(formattedArticles);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(selectedCategories);
  }, [selectedCategories]);

  const handleToggleCategory = (id: string) => {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id];
      updateUserPreferences(updatedCategories); // Sync to database
      return updatedCategories;
    });
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
            onToggleRead={(id) => { }}
            onToggleSave={(id) => { }}
            onShare={() => { }}
          />
        ));
      case 'saved':
        return articles
          .filter((article) => article.isSaved)
          .map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggleRead={(id) => { }}
              onToggleSave={(id) => { }}
              onShare={() => { }}
            />
          ));
      case 'preferences':
        return (
          <Preferences
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
    </div>
  );
}

export default MainContent;
