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

Site HTML/CSS/JavaScript avec serveur Node.js natif, sans dépendances applicatives à installer. `data/restaurant.json` alimente le site, les API et la carte unique recto verso. Démarrer avec `npm start`, vérifier avec `npm test` et exporter avec `node scripts/export.mjs`. Lire `docs/PLAN.md`, `docs/IMAGES.md` et `docs/VERCEL.md` avant de poursuivre. L’hébergement choisi par l’utilisateur est Vercel connecté à GitHub ; distinguer la préparation locale d’un déploiement réellement effectué.
