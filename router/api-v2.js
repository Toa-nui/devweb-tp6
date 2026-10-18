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
    const secret = Math.random().toString(36).substring(2, 8); // Génération du secret aléatoire

    const stmt = db.prepare('INSERT INTO urls (short_url, original_url, secret) VALUES (?, ?, ?)');
    stmt.run(shortUrl, url, secret);

    const newRow = db.prepare('SELECT * FROM urls WHERE short_url = ?').get(shortUrl);
    const fullShortUrl = `${req.protocol}://${req.get('host')}/api-v2/${shortUrl}`;

    res.format({
        'application/json': () => {
            res.status(201).json({
                message: 'URL raccourcie avec succès',
                short_url: shortUrl,
                original_url: url,
                secret: secret
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
            // Exclure le secret pour la réponse JSON (exigence du sujet)
            const { secret, ...dataWithoutSecret } = row;
            res.json(dataWithoutSecret);
        },
        'text/html': () => {
            db.prepare('UPDATE urls SET visit = visit + 1 WHERE short_url = ?').run(url);
            res.redirect(row.original_url);
        },
        default: () => {
            res.status(406).send('Not Acceptable');
        }
    });
});

// DELETE /api-v2/:url
router.delete('/:url', (req, res) => {
    const { url } = req.params;
    const apiKey = req.headers['x-api-key'];

    // 1. Recherche du lien
    const row = db.prepare('SELECT * FROM urls WHERE short_url = ?').get(url);
    if (!row) {
        return res.status(404).json({ error: 'URL non trouvée' });
    }

    // 2. Vérification de la présence de l'en-tête X-API-Key
    if (!apiKey) {
        return res.status(401).json({ error: 'Clé d\'API manquante dans l\'en-tête X-API-Key' });
    }

    // 3. Vérification du secret
    if (apiKey !== row.secret) {
        return res.status(403).json({ error: 'Clé d\'API invalide' });
    }

    // 4. Suppression du lien
    db.prepare('DELETE FROM urls WHERE short_url = ?').run(url);
    return res.status(200).json({ message: 'Lien supprimé avec succès' });
});

export default router;