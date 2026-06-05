/* ================================================
   Quizly API — static files + study set persistence
   ================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '3mb' }));
app.use(express.static(__dirname));

db.initDb();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: db.getProvider() });
});

app.get('/api/sets', async (_req, res) => {
  try {
    const sets = await db.listSets();
    res.json(sets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load study sets' });
  }
});

app.get('/api/sets/:id', async (req, res) => {
  try {
    const set = await db.getSet(req.params.id);
    if (!set) return res.status(404).json({ error: 'Not found' });
    res.json(set);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load study set' });
  }
});

app.post('/api/sets', async (req, res) => {
  try {
    const { id, topic, flashcards, quiz } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required' });
    const saved = await db.upsertSet({ id, topic, flashcards, quiz });
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save study set' });
  }
});

app.delete('/api/sets/:id', async (req, res) => {
  try {
    await db.deleteSet(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete study set' });
  }
});

app.delete('/api/sets', async (_req, res) => {
  try {
    await db.clearSets();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear study sets' });
  }
});

app.listen(PORT, () => {
  console.log(`Quizly running at http://localhost:${PORT}`);
  console.log(`API health: http://localhost:${PORT}/api/health`);
});
