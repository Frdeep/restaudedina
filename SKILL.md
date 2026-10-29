---
name: restaudedina
description: Accompagner la conception et le développement du projet restaudedina dans son dépôt GitHub, en reportant l’installation de l’environnement à la fin du projet.
---

# Projet restaudedina

## Dépôt de référence

- GitHub : https://github.com/Frdeep/restaudedina
- Identifiant : `Frdeep/restaudedina`
- Dossier de travail dans cet environnement : `/workspace/restaudedina`

## Utilisation

Utiliser ce skill pour les demandes concernant le projet restaudedina. Travailler dans le checkout existant du dépôt et lire les éventuelles instructions `AGENTS.md` avant toute modification.

## Consignes du projet

- Lire `BRIEF.md` pour les références du site de La Cuisine de Dina, les sources de contenu et les éléments encore manquants.
- Reporter l’installation et la configuration de l’environnement à la fin du projet, conformément à la demande de l’utilisateur. Ne pas lancer cette installation automatiquement pendant le développement.
- Ne pas supposer de stack technique, de fonctionnalités ou de commandes tant qu’elles ne sont pas définies dans le dépôt ou par l’utilisateur.
- Préserver les fichiers et modifications existants. Adapter ce skill au fur et à mesure des décisions validées pour le projet.
- Ne pas publier, pousser de commits ni déployer sans instruction de l’utilisateur.

## Installation en fin de projet

Lorsque l’utilisateur demande cette étape, inspecter les fichiers du projet, identifier les prérequis réels, puis installer et vérifier le workflow retenu. Enregistrer les instructions reproductibles à partir des commandes effectivement vérifiées.

## Implémentation actuelle

## Refonte demandée après la première version

Dernières instructions prioritaires : fond blanc, texte noir/cacao, jaune conservé, aucun vert ni bordeaux dans l’interface. Le domaine reste `https://restaudedina.vercel.app/`. Facebook : `https://www.facebook.com/p/La-Cuisine-De-DINA-100060362415980/?locale=fr_FR`. Instagram : `https://www.instagram.com/cuisinededina/` (le chemin `/rees/` fourni a été remplacé par le profil). Footer avec aperçus visuels liés aux comptes, sans faux posts ni statistiques.

La refonte dispose de maquettes SVG éditables dans `design/`, créées avant le code et importables dans Figma ; aucun document Figma distant n’a été créé. Le modèle reste inaccessible lors des contrôles. Voir `docs/REFONTE.md` et `docs/VALIDATION-REFONTE.md`. Les huit visuels studio optimisés et la déclinaison marron/jaune du logo sont maintenant intégrés sous `public/media/`. Préserver leur statut de recréations IA et leurs originaux ; ne pas les présenter comme les fichiers photo bruts ou le logo original exact.

L’utilisateur a terminé l’envoi du dernier lot de références après les retouches studio. Pour la refonte, consulter ce skill à chaque étape, analyser précisément `https://defoodtruckclub.nl/` (typographie, structure, animations et ton éditorial adapté à Dina), créer d’abord une maquette Figma ordinateur et mobile, puis reproduire la maquette en code. Concevoir une expérience mobile dédiée et conserver le même projet et domaine Vercel : `https://restaudedina.vercel.app/`.

Ne pas présenter un SVG, une capture ou une maquette HTML comme un fichier créé dans Figma. Aucun outil Figma n’est disponible dans la session lors du contrôle ; le modèle renvoie toujours HTTP 403. Ces limites doivent être résolues ou un format de maquette alternatif explicitement choisi avant de revendiquer le respect de ces étapes.

Les huit rendus studio sont conservés localement dans `artifacts/photos-studio/`, avec une archive `artifacts/dina-photos-studio-complet.zip`. Ce sont des recréations IA, pas les fichiers photo originaux. Ne pas déduire les recettes exactes des desserts ni de la boisson sombre. Ils ne sont pas encore intégrés au site.

### Architecture de la première version

Site HTML/CSS/JavaScript avec serveur Node.js natif, sans dépendances applicatives à installer. `data/restaurant.json` alimente le site, les API et la carte unique recto verso. Démarrer avec `npm start`, vérifier avec `npm test` et exporter avec `node scripts/export.mjs`. Lire `docs/PLAN.md`, `docs/IMAGES.md` et `docs/VERCEL.md` avant de poursuivre. L’hébergement choisi par l’utilisateur est Vercel connecté à GitHub ; distinguer la préparation locale d’un déploiement réellement effectué.
