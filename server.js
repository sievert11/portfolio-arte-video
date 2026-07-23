const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const YT_KEY = process.env.YOUTUBE_API_KEY;

if (!YT_KEY) {
  console.warn('Aviso: variável de ambiente YOUTUBE_API_KEY não definida. O proxy não funcionará sem ela.');
}

app.use(cors());
app.use(express.static('public'));

app.get('/api/playlistItems', async (req, res) => {
  const { playlistId, maxResults = 20 } = req.query;
  if (!playlistId) return res.status(400).json({ error: 'playlistId é obrigatório' });
  if (!YT_KEY) return res.status(500).json({ error: 'Server API key not configured' });

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems`;
    const response = await axios.get(apiUrl, {
      params: {
        part: 'snippet',
        playlistId,
        maxResults,
        key: YT_KEY,
      },
      timeout: 8000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao consultar YouTube Data API:', error.message || error);
    res.status(502).json({ error: 'Erro ao consultar YouTube Data API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
