# La Cuisine de Dina

Site vitrine fullstack, Node.js >=22, sans dépendances externes. Voir [SKILL.md](SKILL.md), [brief](BRIEF.md), [plan](docs/PLAN.md) et [analyse des photos](docs/IMAGES.md).

## Skills Codex du projet

Les instructions permanentes sont dans [AGENTS.md](AGENTS.md), la charte dans [DESIGN.md](DESIGN.md), les 74 skills amont et le routeur dans `.agents/skills/`. Lire [docs/SKILLS.md](docs/SKILLS.md) pour les sources, adaptations et prérequis. Vérifier l’installation avec `python3 scripts/verify-project-skills.py`. Les outils de skills sont distincts de l’application et ne sont pas inclus dans le site exporté.

## Refonte actuelle

Workflow et limites : [REFONTE.md](docs/REFONTE.md). Résultats : [VALIDATION-REFONTE.md](docs/VALIDATION-REFONTE.md). Maquettes ordinateur/mobile importables dans Figma : dossier `design/`. Charte blanche, noire, cacao et jaune ; logo adapté et huit rendus studio dans `public/media/`. Lecteurs officiels Facebook/Instagram et carte Google Maps chargés automatiquement, avec liens directs. Carte de 32 références et PDF téléchargeable inclus.

`npm run build` produit l’export Vercel. `scripts/check-browser.cjs` utilise les outils Playwright/Chromium préinstallés dans cet environnement de développement. `scripts/prepare-media.cjs` est un outil de préparation utilisant Sharp et les originaux locaux ; il n’est pas exécuté au build Vercel. Les médias optimisés, polices et scripts vendor sont committés pour un build reproductible sans ces outils.

Pour rafraîchir la carte PDF après une modification des prix, lancer le serveur puis `node scripts/check-browser.cjs`, copier `artifacts/carte-dina-recto-verso.pdf` vers `public/carte-dina-recto-verso.pdf` et relancer le build. Le test de cohérence PDF dans le parcours final contrôle que les libellés et tarifs du téléchargement correspondent aux données.

## Démarrer
Depuis `/workspace/restaudedina`, exécuter `npm start` (ou `node server.mjs`). Le serveur écoute le port 3000, configurable avec `PORT`. Ne pas créer de worktree : ce checkout est déjà isolé.

## Vérifier et exporter
- `npm test` : tests HTTP et cohérence de la carte.
- `node scripts/export.mjs` : export autonome dans `artifacts/site`, à servir en HTTP pour le panier et les modules JavaScript. Le site, les fiches et les documents juridiques restent consultables sans JavaScript ; le panier est alors désactivé.
- `/carte.html` : deux faces A4, bouton d’impression / sauvegarde PDF ; impression recto verso bord long, échelle 100 %, sans en-têtes de navigateur.
- API : `/api/health`, `/api/menu`, `/api/restaurant`. HTML rendu côté serveur depuis la même source JSON.

## Contenus
Modifier `data/restaurant.json`, puis redémarrer le serveur et régénérer l’export. Les tarifs proviennent des cartes et recherches transmises ; certains ont été relevés sur Uber Eats et restent identifiés comme indicatifs. La carte est une sélection documentée, pas une carte exhaustive validée. Le panier conserve seulement les sélections dans le navigateur ; aucun paiement ou envoi de commande n’est actif. Les lecteurs Meta et Google Maps se chargent automatiquement, sans bouton d’activation.

## Publication
L’export peut être hébergé sur un hébergement statique HTTPS ; pour les API, utiliser un service Node.js >=22 avec `npm start` et variable `PORT`. URL publique et domaine dépendent de cet hébergement. Aucun déploiement public n’est réalisé par ces commandes. Ne pas transmettre une adresse localhost à un client externe.

Avant mise en ligne définitive : intégrer les fichiers photos officiels et le logo, comparer au modèle actuellement inaccessible, confirmer téléphone, horaires, carte et prix, compléter les mentions légales après confirmation de l’exploitant, vérifier domaine et HTTPS. Les comptes sociaux non vérifiés ne sont pas affichés.

## Améliorations version démonstration

Voir `docs/AMELIORATIONS-V2.md` et `docs/VALIDATION-V2.md`. La vidéo du hero est dans `public/video/`. Le catalogue dérivé des 32 références est construit par `scripts/catalog.mjs` ; chaque fiche `produit-<id>.html` et le panier sont exportés statiquement. `public/cart-core.js` valide les sélections et calcule en centimes. `node scripts/check-commerce.cjs` vérifie les parcours, les gestes tactiles synthétisés et les lecteurs Meta automatiques avec réponses externes simulées.

La vente reste désactivée : aucun endpoint de commande ou de paiement n’est créé, aucune donnée bancaire ou personnelle n’est collectée par le panier. Les lecteurs Instagram utilisent une publication de `cuisinededina` et trois de `la_cuisine_de_dina`, avec une story à la une proposée en lien direct ; la réception réelle du contenu reste à vérifier sur un navigateur connecté aux plateformes. Les données juridiques sont dans `data/legal.json`, sans valeurs inventées pour les champs non confirmés.

## Réseaux automatiques et Maps

Voir `docs/FEEDS-AUTOMATIQUES-MAPS.md`. Les deux comptes Instagram sont séparés dans `data/restaurant.json` (`instagramAccounts`). Les lecteurs sont rendus dans le HTML et ne dépendent pas d’un choix sauvegardé dans le navigateur. La carte est générée par `scripts/maps-render.mjs`, sans SDK de générateur. `node scripts/check-media-bento.cjs` vérifie les widgets et Maps aux cinq largeurs, avec et sans JavaScript, en simulant les réponses externes uniquement dans les tests.

## Retouches de publication finale

Bandeau jaune défilant avec pause/reprise et mouvement réduit respecté ; vidéo centrée entre titre et actions sur mobile ; QR statique scannable et cliquable vers le domaine officiel dans les footers. Voir `docs/RETOUCHES-PUBLICATION-FINALE.md` et `scripts/check-final-touch.cjs`.
