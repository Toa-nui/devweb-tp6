import express from 'express';
import path from 'path';
import { PORT } from './config.js';
import apiV1Router from './router/api-v1.js';

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-API-version', '1.0.0');
  next();
});

app.use(express.json());

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'static', 'logo_univ_16.png'));
});

// Utilisation du routeur modularisé
app.use('/api-v1', apiV1Router);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message || 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});