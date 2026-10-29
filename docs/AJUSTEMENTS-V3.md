# Ajustements : photos, adresse et bento social

## Plan exécuté

1. Consulter le routeur Dina, la charte et les skills de direction artistique, UX, mobile, audit et tests. Conserver le site et sa stack.
2. Conserver `https://restaudedina.vercel.app/` comme adresse à partager. Défilement interne sans ajout de fragment ; liens d’ancre natifs conservés en secours sans JavaScript. URL canonique de l’accueil sans fragment.
3. Vérifier les 32 associations produit/média, remplacer les assortiments par défaut et créer les visuels illustratifs manquants dans le style studio blanc.
4. Construire les widgets bento à partir des publications Instagram fournies et du Page Plugin Facebook officiel, avec consentement, retrait, lien direct et bouton de nouvel essai.
5. Vérifier les ressources, les 32 aperçus, le panier, les cinq largeurs, le clavier et l’export ; envoyer sur le même dépôt pour le déploiement Vercel.

## Direction visuelle conservée

Blanc #ffffff, cacao #48291d, noir #201b18, jaune #f4cb39. Bowlby One SC pour les titres, Outfit pour le texte. La grille bento reste limitée aux réseaux : trois publications Instagram ensemble, puis le fil Facebook à côté d’une carte jaune donnant accès au restaurant. Sur mobile, une colonne conserve l’espace nécessaire aux lecteurs officiels et à leur contenu. Pas de fausses légendes, statistiques ou publications locales déguisées en posts.

## Photos et correspondances

`data/product-media.json` rend explicite chaque association. Le catalogue échoue si une association manque : plus de remplacement silencieux par les six assiettes.

22 nouveaux rendus ont été générés en trois planches régulières. Les planches sont optimisées en WebP ; chaque cellule est affichée par CSS, sans découpe approximative mêlant les plats. Les originaux restent dans `artifacts/photos-studio/v3/` et `/workspace/generated_images/`, ignorés par Git. Les fichiers WebP nécessaires au site sont versionnés.

- Planche plats : yassa, mafé, thiou, ailes, chawarma poulet, chawarma agneau, dibi agneau, dibi poulet, cuisse.
- Planche grillades : brochettes poulet, bœuf, agneau, mixtes ; pastels, fatayas, nems ; demi-poulet, bissap blanc.
- Planche boissons : bissap rouge, gingembre, bouye, exemple de soda cola.
- Conservation des vues déjà pertinentes pour thiéb, saka-saka, daurade et poulet entier.
- Les dibi pour plusieurs personnes utilisent la photo du type de plat avec une mention explicite que la quantité n’est pas représentée. Les box gardent un assortiment identifié comme illustratif ; la composition réelle reste à confirmer. Le soda est présenté comme un exemple, sans marque inventée.

Ces rendus ne prouvent ni la recette ni le dressage réels de Dina. La recherche de nouvelles photos distantes a été bloquée par le proxy de cette session. La génération se base sur les références du client et les types de plats, sans annoncer qu’une photo officielle a été retrouvée. La mention de génération et de présentation non contractuelle reste visible.

## Réseaux : choix et limites

Le client a choisi **la sélection des publications fournies**, pas une connexion Meta/API pour synchroniser tout le compte.

Instagram affiche les trois permaliens fournis ensemble, chacun dans un lecteur officiel avec son propre lien de secours. Facebook utilise le lecteur officiel du fil de la page, avec l’URL numérique `https://www.facebook.com/100060362415980/` plutôt que le chemin localisé `/p/…?locale=…`. Aucun lien de publication Facebook individuel n’a été fourni ; aucun n’est inventé.

Les iframes utilisent `strict-origin-when-cross-origin`, et non l’ancienne politique supprimant le référent. Aucun lecteur ni requête Meta avant consentement. Retirer le choix détruit les lecteurs ; réessayer les reconstruit ; les liens externes restent disponibles sans JavaScript.

Un événement `load` d’une iframe externe ne prouve pas que Meta affiche la publication. L’application ne déclare donc jamais le contenu visible sur cette seule base. Les restrictions de comptes, cookies, connexion ou extensions peuvent encore bloquer Meta ; un widget maison ne les supprime pas.

## Publication

Le domaine n’est pas renommé, ni changé en domaine de prévisualisation. Le push sur `main`, le build Vercel et l’accès public sont des étapes distinctes. L’environnement ne dispose d’aucune identité Vercel et bloque les accès HTTPS au domaine public et à Meta (refus CONNECT 403 du proxy). Il ne permet pas de vérifier l’état de publication ou les protections Vercel, ni de certifier l’affichage réel des lecteurs.

## Contrôles exécutés

- `npm test` : 20 tests réussis, notamment toutes les variantes WebP accessibles et des visuels distincts pour les plats, brochettes, entrées et boissons.
- `node scripts/check-commerce.cjs` : parcours panier/produits, double activation, focus, consentement/retrait, trois lecteurs Instagram simultanés, Facebook numérique, navigation sans fragment, cinq largeurs (320/390/768/1024/1440).
- `node scripts/check-browser.cjs` : non-régression, polices/images, filtres, export HTTP, carte PDF sur deux faces, sans JavaScript et mouvement réduit.
- `node scripts/check-media-bento.cjs` : vérification des 32 titres et médias décodables ; quatre lecteurs simultanés après choix, sans débordement à cinq largeurs ; galerie locale des 32 produits et capture du bento avant consentement. Les réponses Meta sont des fixtures techniques, jamais des contenus publiés.
- Inspection visuelle de la galerie : suppression de petites portions de cellules voisines dans les marges des planches ; l’image de saka-saka est également isolée de l’assiette voisine. Les plats pertinents restent entiers dans la mesure des références disponibles.
- Lecteurs Instagram adaptés aux petits écrans par un viewport proportionnel à leur largeur minimale de mise en page ; aucune désactivation du zoom utilisateur. Les observateurs sont nettoyés lors du retrait ou d’un nouvel essai.
- Skills : 74 sources + routeur vérifiés. Guide Vercel récupéré. Détecteur Impeccable : 108 avis consultatifs uniquement sur les cibles, principalement rampe typographique héritée ; aucune sévérité supérieure. Les recommandations n’imposent pas de refonte hors périmètre.
- Captures sous `artifacts/v3/` (non publiées), dont `catalogue-32-photos.png` et `bento-before-consent-1440.png`. La galerie de contrôle isolée autorise son style de test ; la CSP du site public n’a pas été affaiblie.

Aucun contrôle sur un téléphone physique, ni certification d’affichage réel Meta, ni connexion API de synchronisation automatique n’est revendiqué.
