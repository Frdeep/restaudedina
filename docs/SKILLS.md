# Skills Codex — installation du projet

## Résultat

74 skills amont et 1 routeur local `dina-workflow` installés sous `.agents/skills/`. La sélection est systématique via `AGENTS.md` et le routeur ; les 74 contenus ne sont pas tous chargés à chaque message. L’installation est propre au dépôt local, pas globale au compte utilisateur. Dans une session déjà ouverte, lire les fichiers explicitement ; un nouveau chargement de la session Codex peut être nécessaire pour actualiser son catalogue de skills.

Le périmètre est l’amélioration du site existant, pas une nouvelle refonte. Cette installation ne modifie ni les pages, ni le CSS, ni les données du restaurant, ni le build ou les dépendances applicatives, et ne déploie pas le site.

## Sources épinglées

Les liens raccourcis fournis n’étaient pas accessibles via le proxy. Les dépôts complets ci-dessous ont été identifiés puis vérifiés par Git et par leur contenu. Leurs commits complets figurent dans `.agents/skill-sources.json`.

| Dépôt | Skills installés | Commit |
|---|---:|---|
| [anthropics/skills](https://github.com/anthropics/skills) | 2 | `ca45fc496a34` |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 1 | `28b3b8dee8c9` |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 1 | `5e745ace7e15` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | 16 | `a81dbca07f22` |
| [ibelick/ui-skills](https://github.com/ibelick/ui-skills) | 1 | `59193a75432e` |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 1 | `1a2c79d4e6c4` |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 52 | `0cd9b3a0ef4c` |

Anthropic : frontend-design et webapp-testing. UI UX Pro Max : le moteur de recherche, toutes les données CSV et références nécessaires. Impeccable : skill natif Codex, références et lanceur. Emil : les 16 skills du dépôt, dont design, animations, mobile et stress-test d’UI ; les skills Expo et Swift restent disponibles uniquement pour une demande native pertinente. Ibelick : create-design-md. Vercel : web-design-guidelines. Marketing : les 52 skills, avec leurs références et les outils auxiliaires conservés dans `.agents/marketing-tools/`.

## Adaptations traçables

- Original de chaque SKILL.md conservé dans `UPSTREAM-SKILL.md`, licences et attribution conservées. Vercel déclare MIT dans son README mais ne fournit pas de fichier LICENSE autonome dans le commit inspecté : déclaration préservée, notice explicite, aucune attribution inventée.
- Préambule de compatibilité Codex et liens vers `.agents/CODEX-ADAPTER.md`.
- Chemins UI UX Pro Max dépendant de `CLAUDE_PLUGIN_ROOT` remplacés par les chemins du projet.
- Marqueurs empêchant l’invocation automatique retirés des copies actives afin que le routeur puisse les sélectionner ; sources originales intactes.
- Six liens relatifs vers les outils marketing et un lien amont manquant de la checklist Google Ads corrigés vers les références locales réelles. Aucun contenu produit changé.
- Les outils Read, Bash, WebFetch, AskUserQuestion et Browser sont traduits vers les capacités réellement présentes ; aucune dépendance à une session Claude n’est requise.
- Aucun hook automatique activé. Aucun compte, accès réseau, appareil réel ou connecteur Figma/Vercel/marketing n’est ajouté par ces fichiers.

## Règles et contexte

`DESIGN.md` documente la charte existante et validée dans le brief : blanc, noir/cacao, jaune, polices actuellement auto-hébergées. `.agents/product-marketing.md` fournit les faits connus et leurs incertitudes. Les recommandations générées ne remplacent jamais ces contraintes. Aucun produit, fait, garantie, tarif ou témoignage ne doit être inventé.

## Commandes opérationnelles

Depuis la racine du dépôt :

```sh
python3 scripts/verify-project-skills.py
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "keyboard focus modal" --domain ux --json
sh scripts/skill-impeccable.sh context
sh scripts/skill-design-md.sh lint DESIGN.md
sh scripts/skill-design-md.sh export --format dtcg DESIGN.md
sh scripts/skill-web-guidelines.sh
node scripts/skill-browser-smoke.cjs
```

Les commandes d’Impeccable ne sont pas des commandes slash natives de cette interface : appeler le script avec le verbe concerné après avoir lu sa référence. `context` se lance une fois par session ; pour un audit, lire la référence audit. La préparation du moteur ne vaut pas audit réussi du site.

`skill-browser-smoke.cjs` lance son propre serveur HTTP sur un port libre, utilise Playwright Node et Chromium préinstallés, puis arrête ses ressources. Il n’a pas besoin de Python Playwright. Le helper Python amont reste disponible et son aide a été vérifiée. Les caches sont sous `.cache/`, ignorés par Git. Les captures sont sous `artifacts/skills/`, également ignorées.

### Si les outils doivent être restaurés

Le projet ne dépend pas des dossiers temporaires de l’installation. Les skills, données et références sont présents dans le dépôt.

- UI UX Pro Max et le helper serveur : Python 3.
- Impeccable : `sh scripts/skill-impeccable.sh engine-probe` récupère son moteur épinglé si absent, vérifie son SHA-256 selon le manifeste fourni et utilise le cache local. Aucun contournement de TLS ou de checksum.
- DESIGN.md : `npm install --prefix .cache/skills/design-md --cache .cache/skills/npm --no-audit --no-fund @google/design.md@0.4.0`, ou laisser le wrapper utiliser npm exec. Le wrapper réutilise l’installation locale pour travailler hors ligne.
- Navigateur : Playwright Node et Chromium doivent être présents ; `DINA_CHROMIUM_PATH` permet de choisir un autre exécutable Chromium compatible. Un Chromium desktop ne valide pas Safari ou un iPhone physique.
- Les CLI marketing qui appellent des services externes exigent leurs accès propres et une demande explicite ; elles n’ont pas été authentifiées ou exécutées pendant cette installation.

## Vérifications exécutées le 29 octobre 2026

- 75 métadonnées YAML lues et valides, descriptions dans la limite de compatibilité, noms uniques.
- Vérification des empreintes et commits : 74 skills amont, licences/notices et références installés ; aucun lien documentaire local manquant après correction des sept liens repérés.
- Recherche UI UX Pro Max : 3 résultats pertinents sur la visibilité du focus clavier.
- Impeccable : `impeccable-engine 0.1.18` ; téléchargement validé par SHA-256 et lecture du contexte réussie. Le moteur signale que PRODUCT.md n’existe pas ; les améliorations étroites sont explicitement autorisées sur le contexte existant. Un futur travail de nouvelle surface devra suivre le protocole de contexte du skill.
- Vercel Web Interface Guidelines : récupération officielle réussie, 191 lignes ; un nouvel audit doit récupérer la version fraîche ou signaler un accès bloqué.
- DESIGN.md : lint réussi, zéro erreur et un avertissement (absence de token `primary`). Les noms de couleurs sont conservés depuis le CSS ; aucune clé artificielle n’a été ajoutée. Espacement et arrondis non inventoriés faute de contrats de tokens partagés explicites.
- Export DTCG : six couleurs et deux familles typographiques exportées. Le CLI 0.4.0 omet les lineHeight de son export DTCG ; elles restent normatives dans DESIGN.md, sans prétendre que cet export reproduit chaque propriété.
- Playwright réel : 390 et 1440 px, DOM rendu, carte filtrable, 32 références, absence de débordement ; ouverture du menu mobile, Échap et retour du focus ; aucune erreur JavaScript constatée.
- Diff Git des fichiers applicatifs et de publication : aucun changement.

## Maintenance

`skills-lock.json` contient les empreintes des copies adaptées et des originaux. `verify-project-skills.py` détecte les modifications ou références manquantes. Ne pas réécrire le lock pour masquer une dérive ; revoir les changements et conserver les adaptations lors d’une mise à jour explicite.

Les copies amont conservent leurs espaces et fins de ligne, y compris CRLF pour le lanceur Windows. `.gitattributes` empêche leur normalisation automatique afin de préserver les empreintes. Les contrôles d’espaces du code du projet excluent ces copies importées ; leur intégrité est vérifiée par le manifeste.

`install-project-skills.py --fetch` sait reconstruire les copies depuis les commits exacts dans un emplacement où elles ne sont pas déjà installées. Il refuse d’écraser une installation existante. Ne pas supprimer des fichiers pour forcer une mise à jour. L’ajout du pack n’entraîne aucun push GitHub ou déploiement Vercel automatique.
