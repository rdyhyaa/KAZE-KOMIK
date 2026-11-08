const express = require('express');
const cors = require('cors');
const path = require('path');
const { Manga } = require('mangaindo-scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint API (Sama kayak sebelumnya)
app.get('/api/komik', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const data = await Manga.getManga(page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal scraping Komiku' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query wajib diisi' });
    const data = await Manga.search(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal search' });
  }
});

app.get('/api/komik/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const data = await Manga.getDetail(endpoint);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal ambil detail' });
  }
});

app.get('/api/chapter/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const data = await Manga.getChapter(endpoint);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal ambil chapter' });
  }
});

// ====== BAGIAN PENTING ======
// Ngasih tau Express buat nyari file statis di folder 'public'
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Kalau nggak nemu route API, arahin ke index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
// ===========================

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});

module.exports = app;
