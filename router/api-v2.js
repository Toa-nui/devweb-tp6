import express from 'express';
import db from '../database/database.js';

const router = express.Router();

// GET /api-v2/
router.get('/', (req, res) => {
  const row = db.prepare('SELECT COUNT(*) as count FROM urls').get();

  res.format({
    'application/json': () => {
      res.json({ count: row.count });
    },
    'text/html': () => {
      res.render('root', { count: row.count, createdLink: null });
    },
    default: () => {
      res.status(406).send('Not Acceptable');
    }
  });
});

// POST /api-v2/
router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  const shortUrl = Math.random().toString(36).substring(2, 8);
  const stmt = db.prepare('INSERT INTO urls (short_url, original_url) VALUES (?, ?)');
  stmt.run(shortUrl, url);

  const newRow = db.prepare('SELECT * FROM urls WHERE short_url = ?').get(shortUrl);
  const fullShortUrl = `${req.protocol}://${req.get('host')}/api-v2/${shortUrl}`;

  res.format({
    'application/json': () => {
      res.status(201).json({
        message: 'URL raccourcie avec succès',
        short_url: shortUrl,
        original_url: url
      });
    },
    'text/html': () => {
      res.status(201).render('root', {
        count: null,
        createdLink: {
          fullShortUrl: fullShortUrl,
          created_at: newRow.created_at
        }
      });
    },
    default: () => {
      res.status(406).send('Not Acceptable');
    }
  });
});

// GET /api-v2/:url
router.get('/:url', (req, res) => {
  const { url } = req.params;
  const row = db.prepare('SELECT * FROM urls WHERE short_url = ?').get(url);

  if (!row) {
    return res.status(404).json({ error: 'URL non trouvée' });
  }

  res.format({
    'application/json': () => {
      // En JSON, renvoie les informations sur le lien (remplace l'ancienne route /status/:url)
      res.json(row);
    },
    'text/html': () => {
      // En HTML, incrémente le compteur de visites et redirige
      db.prepare('UPDATE urls SET visit = visit + 1 WHERE short_url = ?').run(url);
      res.redirect(row.original_url);
    },
    default: () => {
      res.status(406).send('Not Acceptable');
    }
  });
});

export default router;