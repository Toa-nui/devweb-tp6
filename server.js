import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Router pour l'API v1
const apiV1Router = express.Router();

// 1. GET /api-v1/ -> renvoie le nombre de liens
apiV1Router.get('/', (req, res) => {
  res.json({ count: 0 });
});

// 2. POST /api-v1/ -> reçoit l'URL
apiV1Router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL manquante' });
  }
  res.status(201).json({ message: 'URL reçue', url });
});

// 3. GET /api-v1/error -> génère une erreur 500 pour les tests
apiV1Router.get('/error', (req, res, next) => {
  const err = new Error('Erreur serveur simulée');
  err.status = 500;
  next(err);
});

// 4. GET /api-v1/status/:url -> pas encore implémenté (501)
apiV1Router.get('/status/:url', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

// 5. GET /api-v1/:url -> pas encore implémenté (501)
apiV1Router.get('/:url', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

// Associe le routeur au préfixe /api-v1
app.use('/api-v1', apiV1Router);

// Gestionnaire global des erreurs
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message || 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});