# Validation de la première version

Contrôles exécutés le 29 octobre 2026 dans l’environnement de travail.

- `npm test` : 6 tests exécutés, 6 réussis. Accueil, source commune de 22 références, API menu/restaurant/santé, deux faces de carte avec chaque plat une seule fois, routes privées et traversée de chemins, méthodes HTTP, ressources et requêtes HEAD.
- `node scripts/check-browser.cjs` avec Playwright et Chromium préinstallés : rendu à 320, 768, 1024 et 1440 pixels, aucun débordement horizontal, filtres fonctionnels, navigation mobile et fermeture avec Échap / retour du focus. Aucune erreur console ou JavaScript pendant le parcours testé.
- Impression : contrôle des hauteurs pour éviter les contenus coupés ; `pdfinfo` confirme deux pages A4 dans `artifacts/carte-dina-recto-verso.pdf`. Première face inspectée visuellement.
- Export statique généré et servi via HTTP local : navigation vers les boissons et filtre fonctionnels. L’ouverture `file://` est bloquée par la politique Chromium de l’environnement et n’est donc pas revendiquée comme testée.
- Captures : `artifacts/site-{320,768,1024,1440}.png`. Rendu ordinateur et mobile inspecté.

Les premiers essais HTTP étaient bloqués par le sandbox (EPERM) ; les contrôles ont ensuite été exécutés avec l’autorisation d’exécution nécessaire et ont réussi. L’espacement du recto a été corrigé après détection d’un débordement d’impression.

## Limites restant ouvertes

- Photos visibles analysées, fichiers binaires non accessibles : intégration réelle non effectuée. Correspondances documentées dans `IMAGES.md`.
- Logo officiel non disponible comme fichier ; la signature typographique n’est pas une reproduction du logo.
- Modèle de référence inaccessible (HTTP 403) ; pas de validation de fidélité visuelle.
- Les prix proviennent d’une sélection Uber Eats, pas d’une carte complète en salle confirmée.
- Horaires, téléphone, compositions, allergènes et exploitant légal restent à confirmer.
- Configuration Vercel écrite mais non exécutée sur Vercel ; aucun compte ou jeton disponible. Code local non poussé sur GitHub ; aucun lien public créé.
- Pas d’audit automatique exhaustif WCAG, ni de test de lecteur d’écran ou de compatibilité multi-navigateurs. Contrôles clavier limités au parcours documenté.
