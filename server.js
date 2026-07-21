const express = require('express');
const cors = require('cors');
const axios = require('axios');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy API KHS
app.get('/api/khs', async (req, res) => {
  const { nim, semId } = req.query;
  const authHeader = req.headers.authorization;
  try {
    const response = await axios.get(`https://api.portal2.unand.ac.id/sia/mahasiswa/get-khs?mhsNiu=${nim}&sempSemId=${semId}`, {
      headers: { 'Authorization': authHeader }
    });
    res.json(response.data);
  } catch (err) {
    console.error(`Gagal tarik KHS NIM ${nim}`);
    res.json({ data: [], info: null });
  }
});

// Proxy API Biodata
app.get('/api/mahasiswa', async (req, res) => {
  const { nim } = req.query;
  const authHeader = req.headers.authorization;
  try {
    const response = await axios.get(`https://api.portal2.unand.ac.id/sia/mahasiswa/get-detail-mahasiswa?id=${nim}`, {
      headers: { 'Authorization': authHeader }
    });
    res.json(response.data);
  } catch (err) {
    console.error(`Gagal tarik Nama NIM ${nim}`);
    res.json({ code: 500 });
  }
});

// Serve index.html pada route utama /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files for local testing
app.use(express.static(__dirname));

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('==================================================');
    console.log(`🚀 Peladen Proxy berjalan di http://localhost:${PORT}`);
    console.log('==================================================');
  });
}