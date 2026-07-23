require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const YT_KEY = process.env.YOUTUBE_API_KEY;
if (!YT_KEY) {
  console.error('YOUTUBE_API_KEY não definida em .env');
  process.exit(1);
}

const playlists = [
  { key: 'ia-videos', playlistId: 'PLU-9-ADIACSk' },
  { key: 'client-videos', playlistId: 'PLdlVx0DQvv9E' },
];

async function fetchPlaylistItems(playlistId) {
  let items = [];
  let pageToken = '';
  try {
    do {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: { part: 'snippet', playlistId, maxResults: 50, pageToken, key: YT_KEY }
      });
      const data = res.data || {};
      const vids = (data.items || [])
        .map(item => {
          const s = item.snippet || {};
          const id = s.resourceId && s.resourceId.videoId ? s.resourceId.videoId : '';
          const title = s.title || 'Vídeo';
          return id ? { id, title } : null;
        })
        .filter(Boolean);
      items = items.concat(vids);
      pageToken = data.nextPageToken || '';
    } while (pageToken);
  } catch (err) {
    throw new Error(err.response?.data?.error?.message || err.message || 'Erro ao acessar API');
  }
  return items;
}

(async () => {
  const out = {};
  for (const p of playlists) {
    console.log(`Buscando playlist ${p.playlistId} -> ${p.key}`);
    const vids = await fetchPlaylistItems(p.playlistId);
    out[p.key] = { videos: vids };
  }

  fs.writeFileSync('data/videos.json', JSON.stringify(out, null, 2));
  console.log('Arquivo data/videos.json gerado com sucesso.');
})();
