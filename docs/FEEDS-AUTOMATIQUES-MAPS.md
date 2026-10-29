# Feeds automatiques, deux comptes Instagram et Google Maps

## Consigne actuelle et plan exécuté

1. Reprendre la charte et le routeur Dina ; préserver le reste du site.
2. Supprimer le bouton « Afficher les publications » et les choix de chargement conservés en session. Rendre les lecteurs dans le HTML : chargement automatique, y compris sans JavaScript, avec lazy loading natif quand ils approchent de la zone visible.
3. Garder les deux comptes Instagram séparés. `cuisinededina` devient le compte principal. Associer chaque publication au compte indiqué par le client.
4. Ajouter l’iframe Google Maps fournie, en français, centrée sur le restaurant, dans une carte responsive avec adresse et liens d’itinéraire.
5. Mettre à jour confidentialité, CSP, documentation et contrôles ; publier sur la branche `main` reliée à Vercel.

## Sources sociales

Dans `data/restaurant.json`, `socials.instagramAccounts` remplace la liste de publications commune pour éviter les mélanges :

- Compte principal : `https://www.instagram.com/cuisinededina/`.
- Publication du compte principal fournie avec le chemin utilisateur `/cuisinededina/p/C4GlrBSofJx/`, normalisée vers le permalien de lecteur standard `https://www.instagram.com/p/C4GlrBSofJx/`.
- Story à la une : `https://www.instagram.com/stories/highlights/18057664687533926/`. Carte dédiée avec lien direct ; pas d’iframe de story inventée, Instagram ne fournissant pas de lecteur standard de highlight analogue à celui des publications.
- Deuxième compte : `https://www.instagram.com/la_cuisine_de_dina/` ; ses trois permaliens fournis précédemment restent dans son propre feed.
- Facebook : Page Plugin officiel de la page numérique `100060362415980`.

Le HTML contient quatre lecteurs Instagram et un lecteur Facebook. `public/social-feed.js` améliore leur présentation sur écran étroit et fournit un bouton de nouvel essai. Aucun clic d’approbation ou choix de session n’est requis. Les liens directs restent visibles sans JavaScript. Aucun script Elfsight/Common Ninja n’est chargé.

## Carte

`scripts/maps-render.mjs` reprend l’iframe Maps avec une requête d’adresse précise, `hl=fr`, `z=16` et `output=embed`. La hauteur passe de 420 px à 340 px sur mobile ; le cadre occupe la largeur disponible. Titre accessible, adresse et liens d’itinéraire hors iframe restent utilisables si Google est bloqué. Aucun élément de l’interface native Google n’est masqué ou recouvert.

Le SDK `embedmaps.com` et le lien du générateur ne sont pas nécessaires à l’iframe directe et ne sont pas inclus. La CSP autorise uniquement les origines de frames requises : Meta, `maps.google.com` et `www.google.com`, en plus des règles locales existantes. Aucune autorisation générale de scripts externes n’est ajoutée.

## Transparence

À la demande du client, cette version remplace l’ancien chargement après choix. DESIGN.md, SKILL.md, README et la page de confidentialité reflètent le comportement automatique et la possibilité de requêtes/cookies vers les plateformes. Les documents historiques V2/V3 décrivent l’ancien comportement. Aucune conformité juridique définitive n’est revendiquée : les champs juridiques manquants restent explicites.

Le chargement automatique n’enlève pas les restrictions d’accès de Meta ou Google. Un événement de chargement d’iframe n’est jamais interprété comme preuve que le contenu est visible.

## Validation

- Build statique réussi.
- 22 tests Node réussis : deux comptes, quatre publications, highlight séparé, absence de bouton d’activation, adresse/langue Maps, CSP et confidentialité.
- `scripts/check-commerce.cjs` : parcours produits, panier, dialogues, liens, double activation tactile/souris, lecteurs automatiques et cinq largeurs.
- `scripts/check-media-bento.cjs` : 32 aperçus, compte principal avec sa publication, deuxième compte avec les trois siennes, story en lien, cinq lecteurs sociaux plus Maps, nouvel essai, sans débordement à 320/390/768/1024/1440 px, avec et sans JavaScript.
- Les tests navigateur remplacent les réponses Meta et Google par des fixtures techniques. Ils ne prouvent pas leur affichage réel en production. Captures de mise en page sous `artifacts/v4/`, non publiées comme preuves de contenu réel.
- Sources des 74 skills et routeur vérifiés. Détecteur Impeccable : 124 avis consultatifs uniquement, principalement rampe typographique de la base existante, aucune autre sévérité.

Adresse publique à conserver : `https://restaudedina.vercel.app/`. Le push GitHub et la confirmation de déploiement restent distingués ; aucun accès Vercel direct n’est disponible dans cette session.
