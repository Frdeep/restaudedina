# Widgets sociaux indépendants — Instagram et Facebook

## Demande

Reprendre la fonction des widgets indiqués par le client, présenter les contenus en bento avec les codes visuels Instagram et Facebook, sans marquage Elfsight/Common Ninja, puis publier sur le domaine existant.

Références transmises : application Elfsight `541a90b7-30db-48f7-9fa1-f8aa81d1c60d` et composant Common Ninja `a98d9d7d-3b61-43da-9ceb-494d2bea20b4`.

## Constat et choix d’implémentation

Les deux scripts CDN ont renvoyé un refus réseau HTTP 403 lors de l’inspection. Leur code, leurs réglages et les publications qu’ils collectent n’ont pas été lus. Il ne s’agit donc pas d’une rétro-ingénierie vérifiée de ces services.

Le site remplace leur fonction de présentation par ses composants indépendants. Les scripts fournisseurs ne sont pas installés. Aucune suppression de nœud de branding, réutilisation de code propriétaire, clé API de fournisseur, copie d’un endpoint privé ou modification de leur iframe n’est effectuée. Le marquage de ces fournisseurs est absent parce qu’ils ne participent pas au rendu.

Les publications sont celles déjà fournies par le client, conformément à son choix précédent : les trois permaliens Instagram et la page Facebook officielle. Aucune synchronisation automatique supplémentaire ou récupération du catalogue des fournisseurs n’est annoncée.

## Présentation

- Instagram : en-tête de profil, avatars cerclés, trois cartes de publication avec une carte Reel plus large dans la grille. Une colonne sur téléphone ; grille adaptée sur tablette. En-têtes et liens restent présents après activation des lecteurs.
- Facebook : bandeau de page, avatar, contrôles bleus et carte de fil, à côté de la carte de visite du restaurant.
- Identités des réseaux limitées aux surfaces sociales ; charte blanche/cacao/jaune conservée ailleurs. Les exceptions de couleur demandées sont documentées dans DESIGN.md.
- Pas de faux compteurs de likes/abonnés, badge de vérification, légendes ou photos attribuées sans preuve à une publication.
- Avant consentement, les cartes proposent les vrais liens et annoncent le format Reel/publication ; elles ne sont pas présentées comme des captures des posts.
- Après consentement, les lecteurs officiels Meta sont utilisés, avec retrait, nouvel essai et liens de secours. Le site ne masque pas d’éléments de leurs lecteurs.

## Validation et publication

Build statique réussi, 21 tests Node réussis et contrôles Chromium du bento, des parcours, du consentement et des cinq largeurs (320/390/768/1024/1440). Les réponses Meta sont simulées uniquement dans les tests de routage/consentement. Ces tests ne certifient pas l’affichage réel sur Instagram/Facebook. L’inspection visuelle utilise une capture du bento avant consentement, pas de faux feed rempli.

Les 74 skills amont et le routeur restent intacts. Le détecteur Impeccable a renvoyé 118 avis consultatifs, aucune autre sévérité ; les identités réseau sont un choix explicite du brief, pas une dérive de palette globale.

La publication utilise `main` dans `Frdeep/restaudedina`, déjà relié par le client à Vercel. L’adresse officielle reste `https://restaudedina.vercel.app/`, sans `#venir`. Le réseau de session bloque aussi le domaine public ; aucune vérification distante réussie, déréférencement des widgets fournisseurs ou modification des protections Vercel n’est revendiquée.
