# Validation — améliorations ciblées

## Fonctionnalités réalisées

- Nom La Cuisine de Dina en titre principal, copywriting existant conservé et descriptions renforcées en poids/contraste.
- Cartes accentuées aux spécialités, fiches, aperçus, panier et réseaux, sans convertir toutes les sections en cartes.
- Vidéo locale H.264/AAC 720×1280 d’environ 34 secondes, environ 4,5 Mo ; affiche, son et lecture/pause, lecture muette par défaut, pause hors écran/onglet et préférence de mouvement réduit. Original conservé dans les pièces jointes.
- GSAP : séquence cohérente du hero, feedback léger des aperçus, dialogues et ajouts au panier. Suppression des révélations répétées des sections et du bandeau automatique permanent. Pas de mouvement de survol imposé aux pointeurs tactiles.
- 32 fiches produit et aperçu au survol, focus ou toucher ; double activation souris/tactile, lien explicite et navigation clavier. Les vues précises disponibles sont utilisées sans présenter un assortiment comme une photo certaine du plat.
- Panier avec options incluses, quantités, regroupement, suppression annulable, stockage local expirant, totaux en centimes et simulation de validation sans paiement ou envoi.
- Mentions/CGU/CGV/confidentialité en dialogues natifs et pages autonomes, champs inconnus signalés et CGV de démonstration non contractuelles.
- Nouveau profil Instagram `la_cuisine_de_dina` et trois publications fournies ; iframe officielle sélectionnable après consentement et retrait de consentement. Page Plugin Facebook officiel avec lien de secours ; plus de faux aperçus de flux.

## Résultats exécutés

- `npm test` : 18 tests réussis, aucun échec. Catalogue et 32 routes, méthode/chemins, vidéo HEAD et plages 206/416, catalogue public, stockage invalide/expiré, options et quantités, regroupement et totaux.
- `scripts/check-commerce.cjs` : parcours de bout en bout, cinq largeurs 320/390/768/1024/1440 sans débordement sur accueil, fiches et panier ; double clic et double toucher synthétisé ; choix et ajout, quantités avec focus conservé, persistance, suppression/annulation, simulation, dialogues et retour du focus.
- Vidéo : lecture réellement démarrée dans Chromium, temps courant en progression, piste muette modifiable, aucune erreur de décodage ; préférence de mouvement réduit sans lecture automatique.
- Lecteurs Meta : aucun iframe ni requête avant choix, URL de publication exacte, navigation entre publications, Page Plugin et retrait testés **avec réponses Meta simulées**. Ce test ne prouve pas que Meta autorise l’affichage réel.
- Sans JavaScript : 32 liens de fiches, descriptions, pages juridiques et liens Uber Eats accessibles ; ajout au panier désactivé avec explication.
- `scripts/check-browser.cjs` : non-régression du site et du PDF de deux pages, données/prix concordants, ressources et polices chargées, mode mouvement réduit et export HTTP.
- Captures inspectées : hero ordinateur/mobile, fiche mobile, panier ordinateur ; correction du recadrage et de la résolution du thiéb pour éviter de montrer la rangée voisine.
- Contrastes calculés : cacao/blanc 13,04:1 ; descriptions/blanc 10,70:1 ; cacao/jaune 8,35:1 ; bordure de contrôle/blanc 4,39:1.
- Skills : vérification des 74 sources et du routeur réussie. DESIGN.md : lint sans erreur, avertissement de token `primary` conservé comme dans le contrat existant. Guide Vercel officiel récupéré pour le contrôle des formulaires et de l’accessibilité.

## Audit et limites

Score interne Impeccable : 16/20 — a11y 3, performance 3, thème 3, responsive 3, intégrité 4. Cette estimation limitée au périmètre ne constitue pas une certification WCAG. Le détecteur mécanique a renvoyé 102 avis consultatifs, aucun résultat de sévérité supérieure : principalement tailles responsive absentes d’une rampe exhaustive et couleurs héritées du site. Ils ne justifient pas une refonte de la charte hors demande.

Les tests tactiles sont synthétisés dans Chromium, pas exécutés sur iPhone physique/Safari. Pas d’audit exhaustif de lecteur d’écran ou Lighthouse terrain. Les contenus réels Meta, 21st.dev et les sources juridiques ne sont pas consultables depuis le réseau courant. Les renseignements de société fournis via Pappers par le client sont intégrés, sans publication de sa date de naissance ; les données légales encore manquantes restent explicites ; aucune conformité juridique complète n’est revendiquée. Voir `JURIDIQUE-A-COMPLETER.md` et `COMMANDE-DEMO.md`.

Le push GitHub et l’état du déploiement Vercel doivent être constatés séparément ; le domaine public reste `https://restaudedina.vercel.app/`.
