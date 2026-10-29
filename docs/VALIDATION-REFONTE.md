# Validation de la refonte

## Réalisation

Maquettes `design/desktop.svg` et `design/mobile.svg` créées avant la réécriture du HTML/CSS, importables dans Figma avec formes et textes éditables, photos intégrées. Charte blanc/noir/cacao/jaune ; déclinaison chromatique du logo recréée par IA depuis le logo fourni. Huit rendus studio optimisés en trois largeurs WebP (480/960/1440), provenance conservée dans `data/media-provenance.json`. Polices et GSAP servis localement.

Carte commune de 32 références, ajout des grillades, cinq formats dibi réellement présents sur le visuel fourni, deux chawarmas, sodas, sauces et accompagnements. Aucun prix de dessert ni format dibi poulet quatre personnes inventé. Prix, coordonnées et horaires restent à confirmer auprès du restaurant.

Footer : deux aperçus locaux liés aux comptes Facebook et Instagram fournis ; chemin Instagram corrigé vers le profil ; aucun post, date de publication, nombre d’abonnés ou avis inventé. Pas d’iframe ou de scripts Meta chargés automatiquement.

## Contrôles réalisés le 29 octobre 2026

- `npm test` : 9 tests exécutés, 9 réussis (HTTP, données communes, carte, sécurité des chemins, méthodes, ressources, réseaux et confidentialité).
- Chromium / Playwright : 320, 390, 768, 1024, 1440 pixels, aucun débordement horizontal ; filtres sur les 32 références, navigation et Échap avec retour de focus, chargement et décodage de toutes les images après parcours.
- Vérification de GSAP et des ScrollTriggers en mouvement normal, puis suppression des triggers au passage en mouvement réduit. Animations ne bloquant pas la lecture sans JavaScript ; essais sans JavaScript et liens PDF consignés lors du contrôle final.
- Aucune erreur console ou JavaScript sur le parcours testé. Export statique servi par HTTP et filtre boissons vérifié.
- Impression : contrôle des hauteurs sans contenu coupé ; `pdfinfo` confirme deux pages A4. Verso inspecté visuellement. Le PDF est inclus dans `public/` pour téléchargement sur le site.
- Capture ordinateur inspectée : visuel des six assiettes entièrement visible, toutes les images chargées et aperçus sociaux affichés.
- Ressources visuelles : environ 2,9 Mo pour toutes les variantes WebP des neuf sujets, polices 188 Ko, scripts GSAP environ 128 Ko. Chargement différé des photos hors écran.

## Limites

- Aucun outil Figma dans la session : maquettes SVG livrées, pas de fichier Figma distant. Le template renvoie toujours HTTP 403 ; police, structure et animations exactes non vérifiées. Ne pas revendiquer une copie fidèle de ce qui n’a pas été accessible.
- Images et logo recréés : certains détails diffèrent des originaux, validation commerciale requise.
- Mentions légales complètes de l’exploitant non confirmées. La page informations décrit cette limite et la confidentialité, sans inventer d’identité légale.
- Aucun audit exhaustif WCAG, lecteur d’écran, Safari ou appareil mobile physique.
- GitHub accessible ; lecture du domaine Vercel bloquée par le proxy (CONNECT 403). Le push sur main sera confirmé séparément. Statut de build et contenu public Vercel non vérifiables depuis cet environnement.
