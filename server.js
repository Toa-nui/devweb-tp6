import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Question 4 : Désactiver X-Powered-By
app.disable('x-powered-by');

// Question 5 : Middleware pour l'en-tête X-API-version
app.use((req, res, next) => {
  res.setHeader('X-API-version', '1.0.0');
  next();
});

app.use(express.json());

// Question 6 : Middleware pour favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'static', 'logo_univ_16.png'));
});

// Router pour l'API v1
const apiV1Router = express.Router();

apiV1Router.get('/', (req, res) => {
  res.json({ count: 0 });
});

apiV1Router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL manquante' });
  }
  res.status(201).json({ message: 'URL reçue', url });
});

apiV1Router.get('/error', (req, res, next) => {
  const err = new Error('Erreur serveur simulée');
  err.status = 500;
  next(err);
});

apiV1Router.get('/status/:url', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

apiV1Router.get('/:url', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

app.use('/api-v1', apiV1Router);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message || 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});