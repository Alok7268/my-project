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
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  const user = useUserData();

  // Fetch user preferences
  const fetchUserPreferences = async () => {
    if (!user) return;

    const { data, error } = await nhost.graphql.request(`
      query GetUserPreferences {
        preferences(where: { display_name: { _eq: "${user.displayName}" } }) {
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
            display_name: "${user.displayName}",
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
    });

    if (error) {
      console.error('Failed to update preferences:', error);
    } else {
      console.log('Updated Preferences:', data);
    }
  };

  useEffect(() => {
    if (user) fetchUserPreferences();
  }, [user]);

  // Fetch articles based on categories
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
        isSaved: savedArticles.some((savedArticle) => savedArticle.id === article.url), // Check if article is saved
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
  }, [selectedCategories, savedArticles]); // Re-fetch articles when savedArticles change

  // Fetch saved articles for the user
  const fetchSavedArticles = async () => {
    if (!user) return;

    const { data, error } = await nhost.graphql.request(`
      query GetUserSavedArticles($display_name: String!) {
        user_saved_article(where: { display_name: { _eq: $display_name } }) {
          id
          articles
        }
      }
    `, {
      display_name: user.displayName,
    });

    if (error) {
      console.error('Failed to fetch saved articles:', error);
      return;
    }

    const savedData = data?.user_saved_article?.[0]?.articles || [];
    setSavedArticles(savedData);
  };

  useEffect(() => {
    fetchSavedArticles();
  }, [user]);

  // Handle toggle of save status
  const handleToggleSave = async (id: string, articleData: Article) => {
    if (!user) return;

    // Fetch the existing saved articles
    const { data, error } = await nhost.graphql.request(`
      query GetUserSavedArticles($display_name: String!) {
        user_saved_article(where: { display_name: { _eq: $display_name } }) {
          id
          articles
        }
      }
    `, {
      display_name: user.displayName,
    });

    if (error) {
      console.error('Failed to fetch saved articles:', error);
      return;
    }

    let articlesData = data?.user_saved_article?.[0]?.articles || [];

    // Find the article to update or remove it
    const articleIndex = articlesData.findIndex((article: any) => article.id === id);

    if (articleIndex > -1) {
      // Remove the article if already saved
      articlesData.splice(articleIndex, 1);
    } else {
      // Add the complete article data to the list
      articlesData.push({
        id,
        title: articleData.title,
        summary: articleData.summary,
        imageUrl: articleData.imageUrl,
        url: articleData.url,
        sentiment: articleData.sentiment,
        isRead: articleData.isRead,
        isSaved: true,  // mark as saved
        categories: articleData.categories,
      });
    }

    // If no saved articles exist, create a new entry
    if (data?.user_saved_article?.length === 0) {
      const { data: insertData, error: insertError } = await nhost.graphql.request(`
        mutation InsertUserSavedArticles($display_name: String!, $articles: jsonb) {
          insert_user_saved_article_one(object: {
            display_name: $display_name,
            articles: $articles
          }) {
            id
          }
        }
      `, {
        display_name: user.displayName,
        articles: articlesData,
      });

      if (insertError) {
        console.error('Failed to insert saved articles:', insertError);
      } else {
        console.log('New saved articles entry created');
      }
    } else {
      // If saved articles exist, update them
      const { data: updateData, error: updateError } = await nhost.graphql.request(`
        mutation UpdateUserSavedArticles($display_name: String!, $articles: jsonb) {
          update_user_saved_article(
            where: { display_name: { _eq: $display_name } },
            _set: { articles: $articles }
          ) {
            affected_rows
          }
        }
      `, {
        display_name: user.displayName,
        articles: articlesData,
      });

      if (updateError) {
        console.error('Failed to update saved articles:', updateError);
      } else {
        console.log('Saved articles updated successfully');
      }
    }

    // Update the UI with the current saved state
    fetchSavedArticles();
  };

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
            onToggleSave={(id) => handleToggleSave(id, article)}
            onShare={() => { }}
          />
        ));

      case 'saved':
        return savedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onToggleRead={(id) => { }}
            onToggleSave={(id) => handleToggleSave(id, article)}
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
      <div className="flex-grow">
        <div className="m-4">{renderContent()}</div>
      </div>
    </div>
  );
}

export default MainContent;
