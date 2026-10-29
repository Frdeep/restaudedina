# Plan de réalisation fullstack

## Objectif
Site français de La Cuisine de Dina, avec navigation responsive, carte filtrable, accès Uber Eats, téléphone et itinéraire. Une seule source de données alimente le site et une carte recto verso A4. Le dépôt et son SKILL.md sont la référence de travail.

## Choix techniques
- HTML sémantique, CSS responsive et JavaScript natif : aucun paquet à installer.
- Serveur Node.js >=22, modules natifs uniquement ; API GET /api/restaurant, /api/menu, /api/health.
- Contenu versionné dans data/restaurant.json : pas de base de données ou de collecte de données personnelles inutile pour ce site vitrine.
- Aucun faux formulaire de réservation, panier, paiement ou compte client : les commandes sont confiées à la fiche Uber Eats fournie.
- Prix de livraison clairement distingués des prix en salle, compositions et allergènes non inventés.
- Page /carte imprimable et PDF de deux pages, générés à partir des mêmes données.
- Rendu statique généré pour consultation hors ligne et hébergement statique possible.

## Étapes et critères
1. Structurer les données et conserver leur provenance ; signaler les incertitudes.
2. Construire le serveur, la navigation, les filtres, la page de carte et les liens d’action.
3. Contrôler les API, erreurs HTTP, sécurité des chemins, cohérence du menu et absence de collecte.
4. Contrôler 320, 768, 1024 et 1440 px dans Chromium, navigation au clavier, filtres, erreurs console et impression deux pages.
5. Préparer un livrable statique, le PDF et les instructions de démarrage/déploiement.

## Dépendances éditoriales et externes

État de réalisation : étapes 1 à 4 exécutées pour la première version, résultats dans `docs/VALIDATION.md`. Étape 5 : export statique, archives et configuration Vercel préparés ; hébergement choisi par l’utilisateur, connexion au compte et publication restantes. Les photos ont été reçues visuellement et analysées dans `docs/IMAGES.md`, mais leurs fichiers ne sont pas accessibles à l’exécution.
- Les nouvelles images annoncées ne sont pas jointes à la conversation. Aucun rapprochement photo/plat ne peut être réalisé avant leur réception. Consigner chaque association, ses indices et sa validation dans docs/IMAGES.md.
- Le logo visible dans la conversation n'est pas disponible comme fichier local : ne pas le recréer en prétendant utiliser le fichier officiel.
- Le modèle https://defoodtruckclub.nl/ renvoie 403 : fidélité visuelle à contrôler dès réception de captures ou rétablissement d'accès.
- Menu reçu : sélection de plats, pas une carte exhaustive confirmée ; tarifs Uber Eats, horaires et téléphone à faire valider.
- Hébergement public et domaine non configurés : ne pas présenter localhost comme lien client. Préparer un export partageable ; la publication demandera un hébergeur accessible.
