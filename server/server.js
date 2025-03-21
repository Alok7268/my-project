const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your React app's domain
app.use(cors({ origin: 'http://192.168.1.12:3100' })); // Update with your React app's URL

app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines?sources=bbc-news', {
            headers: { Authorization: 'Bearer d5336fa9284d4f29a443fca749c4d22e' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://192.168.1.12:${PORT}`);
});