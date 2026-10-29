# Données et vérifications juridiques restantes

Les dialogues et pages `mentions.html`, `cgu.html`, `cgv.html` et `confidentialite.html` sont implémentés. Leur rédaction est une base de préversion, pas une certification de conformité.

## Source fournie

Le client a désigné `https://www.societe.com/societe/dina-s-food-951262922.html`. DINA’S FOOD et le SIREN 951 262 922 étaient également présents dans les recherches transmises. L’accès à cette page a renvoyé HTTP 403 ; les détails n’ont pas été vérifiés en ligne. Ne pas transformer l’adresse commerciale rue Vivenel en siège social ni la présidente supposée en directrice de publication sans confirmation.

Le client a ensuite fourni les informations issues de Pappers : DF DINA’S FOOD, SAS, RCS Compiègne, SIREN 951 262 922, SIRET du siège 951 262 922 00010, TVA FR84951262922, capital 500 €, siège 35 rue Vivenel à Compiègne, présidence Medina Tall. Elles sont désormais renseignées dans `data/legal.json`, avec leur provenance client. La date de naissance n’est pas publiée, faute d’utilité pour le site.

## Données manquantes

- Adresse électronique et directeur de publication.
- Coordonnées légales complètes de l’hébergeur à vérifier selon le prestataire effectivement contracté.
- Médiateur compétent et coordonnées ; règles de réclamation.
- Caractéristiques complètes, allergènes, prix TTC/frais, modes et délais de livraison/retrait, disponibilités et conditions d’annulation/remboursement.
- Responsable de traitement, durées et destinataires des éventuels journaux d’hébergement, modalités d’exercice des droits.

Le client a été invité à copier les informations de la fiche bloquée et à fournir les modalités commerciales non publiées. Ces valeurs restent `null` dans `data/legal.json` et sont signalées dans l’interface. La vente sur le site reste désactivée.

## Bases officielles à vérifier à l’ouverture

- Service Public Entreprendre, mentions obligatoires d’un site professionnel : `https://entreprendre.service-public.gouv.fr/vosdroits/F31228`.
- LCEN, notamment informations d’éditeur et d’hébergeur ; textes officiels sur `https://www.legifrance.gouv.fr/`.
- Code de la consommation, notamment L111-1, L221-5, L221-14, L221-28, L612-1 et L616-1, selon la qualification exacte des prestations.
- CNIL et RGPD : information des personnes, minimisation, droits, traceurs et lecteurs tiers ; `https://www.cnil.fr/`.

Ces références servent à la vérification et à la revue finale. Le réseau a bloqué les lectures officielles pendant cette tâche ; leur actualité et leur applicabilité ne sont pas déclarées vérifiées. Aucune ancienne plateforme européenne de règlement en ligne des litiges n’a été ajoutée automatiquement.

Les domaines Société.com, Service Public, Légifrance, CNIL, Meta Developers et 21st.dev ont été ajoutés au **brouillon** de la configuration réseau en préservant les règles existantes. Leur enregistrement n’active pas ces accès ; la revue, l’enregistrement et la publication de l’environnement restent nécessaires pour modifier la politique appliquée.
