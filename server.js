const express = require('express');
const cors = require('cors');
const { Manga } = require('mangaindo-scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint buat ambil list komik terbaru
app.get('/api/komik', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const data = await Manga.getManga(page, limit);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal scraping Komiku' });
  }
});

// Endpoint buat search
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query wajib diisi' });
    const data = await Manga.search(query);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal search' });
  }
});

// Endpoint buat detail komik
app.get('/api/komik/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const data = await Manga.getDetail(endpoint);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal ambil detail' });
  }
});

// Endpoint buat baca chapter
app.get('/api/chapter/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const data = await Manga.getChapter(endpoint);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal ambil chapter' });
  }
});

// Serve file statis dari folder public
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});