import express from 'express';
import db from '../database/database.js';

const router = express.Router();

// GET /api-v1/ -> Retourne le nombre total d'URLs enregistrées
router.get('/', (req, res) => {
  const row = db.prepare('SELECT COUNT(*) as count FROM urls').get();
  res.json({ count: row.count });
});

// POST /api-v1/ -> Raccourcit une URL
router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  // Génération d'une chaîne aléatoire courte (6 caractères)
  const shortUrl = Math.random().toString(36).substring(2, 8);

  const stmt = db.prepare('INSERT INTO urls (short_url, original_url) VALUES (?, ?)');
  stmt.run(shortUrl, url);

  res.status(201).json({
    message: 'URL raccourcie avec succès',
    short_url: shortUrl,
    original_url: url
  });
});

// GET /api-v1/status/:url -> Consulter les stats d'un lien
router.get('/status/:url', (req, res) => {
  const { url } = req.params;
  const row = db.prepare('SELECT * FROM urls WHERE short_url = ?').get(url);

  if (!row) {
    return res.status(404).json({ error: 'URL non trouvée' });
  }

  res.json(row);
});

// GET /api-v1/:url -> Redirection + Incrémentation du nombre de visites
router.get('/:url', (req, res) => {
  const { url } = req.params;
  const row = db.prepare('SELECT * FROM urls WHERE short_url = ?').get(url);

  if (!row) {
    return res.status(404).json({ error: 'URL non trouvée' });
  }

  // Incrémenter le nombre de visites
  db.prepare('UPDATE urls SET visit = visit + 1 WHERE short_url = ?').run(url);

  // Redirection HTTP 302
  res.redirect(row.original_url);
});

export default router;