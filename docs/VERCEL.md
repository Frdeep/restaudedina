# Déploiement Vercel avec GitHub

Choix de l’utilisateur : Vercel connecté à `Frdeep/restaudedina`.

## Configuration préparée
- `vercel.json` : export du site statique et API Node.js sans dépendances externes.
- Build : `node scripts/export.mjs`.
- Sortie : `artifacts/site`.
- Installation : vérification de Node, aucune dépendance à installer.
- Fonctions : `/api/health`, `/api/menu`, `/api/restaurant`, même gestionnaire que le serveur local.

## Connexion depuis le compte propriétaire
1. Le code doit être commité et poussé sur GitHub avant import. Cette session n’a pas publié les fichiers locaux.
2. Dans Vercel, créer un projet et importer le dépôt `Frdeep/restaudedina` via l’intégration GitHub du propriétaire.
3. Sélectionner la racine du dépôt ; conserver les réglages du fichier `vercel.json`, Node.js 24.x et le preset Other si demandé. Aucun secret applicatif requis.
4. Déployer la préversion. Copier l’URL réellement attribuée par Vercel, sans en inventer une.
5. Vérifier l’accueil, `/carte.html`, `/api/health`, `/api/menu` et `/api/restaurant`, les liens d’action, le rendu mobile et l’impression. La configuration Vercel est préparée ; son exécution distante n’est pas vérifiée tant qu’aucun déploiement n’a eu lieu.
6. Vérifier les réglages Deployment Protection : une préversion protégée peut demander une connexion Vercel ; utiliser un lien de partage Vercel ou les paramètres d’accès adaptés au client.

## État
Aucune CLI Vercel ni variable VERCEL_TOKEN, VERCEL_ORG_ID ou VERCEL_PROJECT_ID disponible dans cette session au moment du contrôle. Ne jamais transmettre de jeton dans le chat. La connexion GitHub et la publication depuis le compte Vercel restent nécessaires pour obtenir un lien public.
