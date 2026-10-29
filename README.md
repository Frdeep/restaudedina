# La Cuisine de Dina

Site vitrine fullstack, Node.js >=22, sans dépendances externes. Voir [SKILL.md](SKILL.md), [brief](BRIEF.md), [plan](docs/PLAN.md) et [analyse des photos](docs/IMAGES.md).

## Refonte actuelle

Workflow et limites : [REFONTE.md](docs/REFONTE.md). Résultats : [VALIDATION-REFONTE.md](docs/VALIDATION-REFONTE.md). Maquettes ordinateur/mobile importables dans Figma : dossier `design/`. Charte blanche, noire, cacao et jaune ; logo adapté et huit rendus studio dans `public/media/`. Aperçus Facebook/Instagram locaux sans scripts de suivi. Carte de 32 références et PDF téléchargeable inclus.

`npm run build` produit l’export Vercel. `scripts/check-browser.cjs` utilise les outils Playwright/Chromium préinstallés dans cet environnement de développement. `scripts/prepare-media.cjs` est un outil de préparation utilisant Sharp et les originaux locaux ; il n’est pas exécuté au build Vercel. Les médias optimisés, polices et scripts vendor sont committés pour un build reproductible sans ces outils.

Pour rafraîchir la carte PDF après une modification des prix, lancer le serveur puis `node scripts/check-browser.cjs`, copier `artifacts/carte-dina-recto-verso.pdf` vers `public/carte-dina-recto-verso.pdf` et relancer le build. Le test de cohérence PDF dans le parcours final contrôle que les libellés et tarifs du téléchargement correspondent aux données.

## Démarrer
Depuis `/workspace/restaudedina`, exécuter `npm start` (ou `node server.mjs`). Le serveur écoute le port 3000, configurable avec `PORT`. Ne pas créer de worktree : ce checkout est déjà isolé.

## Vérifier et exporter
- `npm test` : tests HTTP et cohérence de la carte.
- `node scripts/export.mjs` : export autonome dans `artifacts/site`, consultable en ouvrant `index.html`. Les filtres, navigation et impression fonctionnent aussi sans serveur. Le site reste lisible sans JavaScript.
- `/carte.html` : deux faces A4, bouton d’impression / sauvegarde PDF ; impression recto verso bord long, échelle 100 %, sans en-têtes de navigateur.
- API : `/api/health`, `/api/menu`, `/api/restaurant`. HTML rendu côté serveur depuis la même source JSON.

## Contenus
Modifier `data/restaurant.json`, puis redémarrer le serveur et régénérer l’export. Les tarifs reçus sont des tarifs Uber Eats et restent identifiés comme tels. La carte est une sélection documentée, pas une carte exhaustive validée. Pas de collecte de données personnelles, de cookies de suivi, de formulaire ni de paiement local.

## Publication
L’export peut être hébergé sur un hébergement statique HTTPS ; pour les API, utiliser un service Node.js >=22 avec `npm start` et variable `PORT`. URL publique et domaine dépendent de cet hébergement. Aucun déploiement public n’est réalisé par ces commandes. Ne pas transmettre une adresse localhost à un client externe.

Avant mise en ligne définitive : intégrer les fichiers photos officiels et le logo, comparer au modèle actuellement inaccessible, confirmer téléphone, horaires, carte et prix, compléter les mentions légales après confirmation de l’exploitant, vérifier domaine et HTTPS. Les comptes sociaux non vérifiés ne sont pas affichés.
