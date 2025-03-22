const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Sentiment = require('sentiment'); // Import Sentiment library

const app = express();
const PORT = process.env.PORT || 3001;

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const API_KEY = '36686ae62b914545b1e4e2afe2bc7b95';

const sentiment = new Sentiment(); // Initialize sentiment instance

app.use(cors({ origin: 'http://192.168.1.12:3100' }));

app.get('/api/news', async (req, res) => {
    const { categories } = req.query;

    console.log(`[INFO] Incoming request to /api/news`);
    console.log(`[INFO] Categories received: ${categories || 'None (default headlines)'}`);

    try {
        let apiUrl;

        if (categories) {
            const query = categories.split(',').join(' OR ');
            apiUrl = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
        } else {
            apiUrl = `${NEWS_API_BASE_URL}/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
        }

        console.log(`[DEBUG] Formed API URL: ${apiUrl}`);

        const response = await axios.get(apiUrl);
        const articles = response.data.articles || [];

        console.log(`[SUCCESS] Data fetched successfully. Articles count: ${articles.length}`);

        // Add sentiment analysis to each article
        const articlesWithSentiment = articles.map(article => {
            const sentimentResult = sentiment.analyze(article.title + ' ' + article.description);
            let sentimentLabel = 'neutral';

            if (sentimentResult.score > 2) {
                sentimentLabel = 'positive';
            } else if (sentimentResult.score < -2) {
                sentimentLabel = 'negative';
            }

            return { ...article, sentiment: sentimentLabel };
        });

        res.json({ articles: articlesWithSentiment });
    } catch (error) {
        console.error(`[ERROR] Failed to fetch news data: ${error.message}`);
        if (error.response) {
            console.error(`[ERROR] Response data:`, error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://192.168.1.12:${PORT}`);
});
