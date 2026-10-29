# Retouches de publication finale

Périmètre limité à trois demandes, charte et parcours existants conservés.

## Bandeau jaune

Défilement continu CSS linéaire avec deux groupes identiques suffisamment longs pour couvrir le viewport. Seule la transformation est animée. Le bouton 44 × 44 px permet pause/reprise avec libellé et état accessibles. La préférence de mouvement réduit conserve un bandeau fixe. Sans JavaScript, le texte reste lisible et fixe ; aucun bouton inopérant n’est affiché.

## Hero mobile

Ordre DOM et visuel : titre/accroche, vidéo centrée, description et actions. La grille garde la vidéo à droite sur ordinateur. Ce placement évite de déplacer uniquement l’image par CSS avec un ordre clavier différent. Lecture/pause, contrôle sonore et vidéo existants conservés.

## QR du footer

URL encodée : `https://restaudedina.vercel.app/`, sans fragment ni redirection vers un service de QR. Le même site responsive s’adapte au téléphone qui l’ouvre : il n’existe pas de second domaine mobile.

QR statique noir sur blanc, correction d’erreur Q, marge calme de quatre modules. SVG/PNG dans `public/qr/`. Présent dans le footer d’accueil et les footers communs des fiches/panier/pages juridiques, sur ordinateur comme téléphone. Le QR est cliquable pour les visiteurs qui utilisent déjà leur téléphone.

Génération reproductible : `scripts/generate-footer-qr.py` avec qrcode 8.2 et zxing-cpp 2.3.0, dépendances de développement temporaires, sans dépendance applicative ou appel réseau du site. Le décodage indépendant confirme l’URL exacte ; les captures du QR réellement rendu à 320/390/768/1024/1440 px ont toutes été décodées indépendamment avec la même URL exacte.

## Vérifications

- Build statique et 22 tests Node.
- `scripts/check-final-touch.cjs` : centrage et ordre de la vidéo à 320/390 px, disposition ordinateur à 768/1024/1440 px, QR visible aux cinq largeurs, footer de fiche, défilement réel, pause/reprise et préférence de mouvement réduit.
- `scripts/check-browser.cjs` : non-régression aux cinq largeurs, filtres, polices/images, export HTTP, sans JavaScript et carte PDF deux faces.
- Détecteur Impeccable : 124 avis consultatifs, aucune autre sévérité ; aucune refonte hors périmètre.
- Captures dans `artifacts/final-touch/` ; réponses Meta/Maps remplacées par fixtures dans les tests locaux, sans revendication d’affichage distant.

Publication sur `main` pour le projet Vercel existant. Adresse conservée : `https://restaudedina.vercel.app/`. Le push GitHub ne certifie pas à lui seul l’état du déploiement public, inaccessible depuis le réseau de cette session.
