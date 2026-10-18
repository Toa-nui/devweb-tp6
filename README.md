# TP6 (CC4)- Raccourcisseur d'URL

- **URL du projet déployé** : https://devweb-tp6-toanui-levionnois.onrender.com
- **Dépôt GitHub** : https://github.com/Toa-nui/devweb-tp6

...

TP6 - CC4 : Réducteur d'URL en Node.js / Express

Ce projet est réalisé dans le cadre du cours de développement web. Il s'agit d'un service complet de réduction d'URL (type Bitly / TinyURL) avec API REST, base de données SQLite et client web.

Fonctionnalités & Avancement

- [x] Partie 1 : Prise en main & initialisation

  - Configuration d'Express, des variables d'environnement ('.env') et des scripts npm.
  - Implémentation des middlewares ('X-API-version', désactivation de 'X-Powered-By', gestion de 'favicon.ico').
  - Implémentation des routes de base sous '/api-v1/' ('GET /', 'POST /', 'GET /error', réponses 501 pour les routes non encore développées).
  - Réponses rédigées dans le fichier 'REPONSES.md'.

- [x] Partie 2 : API v1 (Base de données SQLite)

  - Factorisation de la configuration dans 'config.js'.
  - Connexion SQLite et création automatique de la table dans 'database/database.js'.
  - Implémentation complète de l'API v1 dans 'router/api-v1.js' (raccourcissement, comptage des visites, statut et redirection HTTP 302).

- [x] Partie 3 : HTML & Négociation de contenu (API v2)
  - Support de 'res.format()' pour répondre en JSON ou HTML selon l'en-tête 'Accept'.
  - Intégration du moteur de rendu 'ejs' et création de la vue 'views/root.ejs'.
  - Implémentation du routeur '/api-v2/' avec gestion des formulaires et redirection.

- [x] Partie 4 : Client AJAX (tag: client-ajax)
 - Implémentation de l'interface client SPA dans 'static/index.html' et 'static/client.html'.
 - Communication asynchrone avec l'API v2 via 'fetch()' dans 'static/app.js'.
 - Intégration de l'API Clipboard pour la copie rapide des liens raccourcis.

- [x] Partie 5 : Suppression & Authentification (tag: api-v2-delete)
 - Ajout du champ 'secret' en base de données SQLite pour l'authentification des liens.
 - Création de la route 'DELETE /api-v2/:url' sécurisée via l'en-tête 'X-API-Key' (codes HTTP 200, 401, 403, 404).
 - Exclusion du champ 'secret' lors des réponses JSON sur la route 'GET /api-v2/:url'.
 - Création de la documentation OpenAPI dans 'static/open-api.yaml' avec support du schéma de sécurité 'ApiKeyAuth'.

## Démonstration et Tests

### Interface Swagger OpenAPI
![Swagger Auth](docs/swagger.png)

### Tests des routes avec curl
![Tests Curl 201 401 403](docs/curl-201-401-403.png)
![Tests Curl 200](docs/curl-200.png)

...

Toanui LEVIONNOIS