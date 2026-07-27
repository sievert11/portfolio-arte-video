# portfolio-arte-video

Repositório para página minimalista com meu portfólio de fotografia, postagens criadas para clientes, além de vídeos tradicionais e vídeos totalmente criados com IA.

Atualizada em julho de 2026.

Configuração da chave da YouTube Data API
----------------------------------------

1. Crie um arquivo `config.js` a partir de `config.example.js`:

	- Copie `config.example.js` para `config.js`.
	- Substitua `SUA_CHAVE_AQUI` pela sua chave da YouTube Data API.

2. Não envie `config.js` ao repositório. Ele já está listado em `.gitignore`.

3. Alternativa segura: proxy as chamadas à YouTube Data API pelo seu backend e mantenha a chave no servidor.

Teste rápido da API (substitua `YOUR_KEY` e `PLAYLIST_ID`):

```bash
curl "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLAYLIST_ID&maxResults=1&key=YOUR_KEY"
```

Observação: se a chave não estiver configurada, a página usará `data/videos.json` como fallback local.

Proxy seguro com Node.js
-----------------------

1. Instale dependências e crie `.env` a partir de `.env.example`:

```bash
npm install
cp .env.example .env
# edite .env e coloque sua YOUTUBE_API_KEY
```

2. Inicie o servidor (desenvolvimento):

```bash
npm run start
```

4. Quando o servidor estiver rodando, o front-end tentará o proxy em `/api/playlistItems` automaticamente se a chave cliente não estiver definida.

Adicionar novas fotos ao site
----------------------------

1. Crie a pasta `photos/` no root do repositório.
2. Dentro de `photos/`, crie uma subpasta para cada conjunto de imagens, por exemplo `instagram/`, `ads/` ou `comercial/`.
3. Coloque apenas arquivos de imagem válidos nas subpastas (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`).
4. Gere o arquivo de dados JSON:

```bash
npm run generate:photos
```

5. Commit as pastas de imagens e o arquivo `data/photos.json`.

O script cria `data/photos.json` automaticamente a partir das pastas e imagens encontradas em `photos/`. Cada subpasta vira um carrossel e as imagens recebem texto alternativo padrão no formato `nomedapasta 1`, `nomedapasta 2`, etc.

Observação: se você for servir os arquivos estáticos diretamente com o servidor Node, mova o conteúdo do projeto para a pasta `public/` ou ajuste `express.static` conforme necessário.