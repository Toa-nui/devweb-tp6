Réponses - Partie 1 : Prise en main

1.Commande httpie pour la route POST

http POST http://localhost:8080/api-v1/ url="[https://perdu.com](https://perdu.com)"

2.Différences entre mode production et développement

 -npm run prod (node server.js) : Exécute l'application directement. Si une modification est apportée au code, il faut relancer manuellement le serveur.

 -npm run dev (node --watch server.js) : Lance le serveur avec le mode d'observation (--watch). Le serveur redémarre automatiquement à chaque sauvegarde de fichier.

3.Script npm de formatage automatique

Dans le fichier package.json, on peut ajouter un script utilisant Prettier :

"format": "prettier --write \"**/*.mjs\""

4.Désactiver l'en-tête X-Powered-By

Pour masquer la présence d'Express pour des raisons de sécurité :

app.disable('x-powered-by');

5.Middleware custom pour l'en-tête X-API-version

app.use((req, res, next) => {
  res.setHeader('X-API-version', '1.0.0');
  next();
});

6.Middleware pour favicon.ico

Utilisation du package serve-favicon ou redirection directe :

import favicon from 'serve-favicon';
import path from 'path';

app.use(serveFavicon(path.join(process.cwd(), 'static', 'logo_univ_16.png')))
(Ou via une route dédiée Express : app.get('/favicon.ico', (req, res) => res.sendFile(path.join(process.cwd(), 'static/logo_univ_16.png')));)

7.Liens vers la documentation du driver SQLite

-Driver better-sqlite3 : https://github.com/WiseLibs/better-sqlite3
-Documentation SQLite officielle : https://www.sqlite.org/docs.html

8.Connexion et fermeture de la base de données

-Ouverture : La connexion est ouverte au démarrage de l'application lors de l'instanciation de l'objet SQLite (new Database(...)).
-Fermeture : La connexion reste ouverte durant toute l'exécution du serveur et est automatiquement fermée à l'arrêt du processus Node.js (ou via db.close()).

9.Gestion du cache par Express

Lorsqu'on navigue en mode privé puis qu'on rafraîchit avec Ctrl+Shift+R (hard refresh), le navigateur contourne le cache local et renvoie le header Cache-Control: no-cache. Express ne met pas en cache les réponses dynamiques JSON par défaut, mais peut répondre avec un statut 304 Not Modified si les en-têtes ETag correspondent.

10.Communication entre deux instances sur des ports différents

Les liens créés sur l'instance :8080 sont immédiatement visibles sur l'instance :8081 car les deux instances partagent la même base de données SQLite sur le disque (définie par DB_FILE=database/database.sqlite dans le fichier .env).

Réponses - Partie 2