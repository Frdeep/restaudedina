# Workflow de refonte — La Cuisine de Dina

## Demande et critères

1. Relire `SKILL.md`, les sources de contenu et les instructions de conception.
2. Analyser https://defoodtruckclub.nl/ : structure, typographie, animations et ton éditorial. Le 29 octobre 2026, la nouvelle tentative renvoie HTTP 403 ; aucune police ou animation exacte ne peut être attribuée au modèle sans accès. Conserver cette limite et prévoir la comparaison dès que des captures sont disponibles.
3. Réaliser les maquettes ordinateur et mobile AVANT la refonte du code. Aucun outil Figma disponible ; livrer `design/desktop.svg` et `design/mobile.svg`, importables et éditables dans Figma, sans prétendre qu’un document Figma distant a été créé.
4. Reproduire les maquettes en HTML/CSS, avec une source JSON commune au site, aux API et à la carte recto verso. Utiliser les huit rendus studio, optimiser les fichiers pour le Web, conserver la provenance IA et ne pas inventer une recette de dessert.
5. Palette : blanc #ffffff, brun cacao #48291d, noir doux #201b18, jaune #f4cb39. Supprimer bordeaux et vert des éléments d’interface. Préparer une déclinaison chromatique du logo fourni, distincte de son fichier original non accessible sous forme binaire.
6. Intégrer les nouveaux éléments des cartes fournies : grillades, formats dibi, chawarmas, sauces, accompagnements et sodas. Ne pas présenter les prix comme validés ; pas de création de produits ou prix depuis une simple photo.
7. Footer : aperçus visuels des comptes fournis, liens Facebook et Instagram, aucun faux post ou nombre d’abonnés. Corriger `/rees/` en lien canonique de profil. Pas d’embed ni traceur chargé automatiquement.
8. Mobile : menu accessible, cibles tactiles, navigation rapide vers carte/commande/appel, cartes horizontales manipulables sans piège de défilement, pas d’effet de pinning sur petit écran, respect de `prefers-reduced-motion`.
9. Contrôler les API, la cohérence des plats, les ressources, les liens, le clavier, les filtres, les animations et 320/390/768/1024/1440 pixels ; vérifier le PDF de deux pages.
10. Envoyer sur la même branche `main` et le même dépôt connecté à Vercel. Vérifier le domaine existant https://restaudedina.vercel.app/ si le réseau l’autorise. Un push ne prouve pas à lui seul un déploiement réussi.

## Design plan

La charte et l’ordre du workflow explicitement demandés par l’utilisateur priment sur les variations arbitraires proposées dans les skills génériques. Composition retenue : ouverture typographique large, photos de plats sur blanc, typographie d’affiche, alternance blanc/jaune, détails bruns et mouvement sobre.

<design_plan>
Hero : composition typographique centrée, titre sur 2 lignes avec largeur max 1200 px, puis vue de plats et deux actions contrastées.
Typographie : Bowlby One SC pour les titres d’affiche et Outfit pour le texte, auto-hébergées, licences OFL conservées. Police exacte du modèle non vérifiée.
Composants : bande de spécialités animée, galerie éditoriale, aperçus sociaux. Navigation → attention → découverte des plats → galerie en mouvement → carte → visite → réseaux/commande.
GSAP : révélations progressives et légère mise à l’échelle des photos ; titre de galerie épinglé sur ordinateur uniquement. Contenu lisible avant chargement et sans JavaScript.
Grilles : 2 colonnes pour les deux cartes sociales, galerie à trois cartes de largeurs identiques ; remise en colonne sur mobile, aucune case vide imposée.
Contraste : texte cacao/noir sur blanc ou jaune, texte blanc sur cacao. Cibles minimum 44 px. Ni statistiques inventées, ni avis fictifs.
</design_plan>

## Statut

Plan enregistré avant la réalisation. Résultats de vérification et limites finales dans `docs/VALIDATION-REFONTE.md`.
