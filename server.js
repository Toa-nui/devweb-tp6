import express from 'express';
import path from 'path';
import { PORT } from './config.js';
import apiV1Router from './router/api-v1.js';
import apiV2Router from './router/api-v2.js';

const app = express();

app.disable('x-powered-by');

// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use((req, res, next) => {
  res.setHeader('X-API-version', '2.0.0');
  next();
});

// Middleware pour analyser le JSON et les données de formulaires HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'static', 'logo_univ_16.png'));
});

// Routeurs
app.use('/api-v1', apiV1Router);
app.use('/api-v2', apiV2Router);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message || 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});