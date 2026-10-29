---
name: dina-workflow
description: Routeur permanent du projet La Cuisine de Dina. À consulter pour chaque tâche afin de sélectionner les skills de design, mobile, animations, audit, copywriting et tests nécessaires sans refaire le site hors périmètre.
---

# Workflow Dina pour Codex

Lire `AGENTS.md`, `SKILL.md`, `DESIGN.md`, `.agents/CODEX-ADAPTER.md`. Utiliser le checkout existant et les dernières contraintes du client. Le mode actuel est **amélioration ciblée**, jamais refonte implicite.

## Séquence

1. **Cadrer** : relire la demande, le contexte et la charte ; identifier les surfaces touchées. Éviter les questions déjà résolues dans les documents du projet.
2. **Concevoir** : charger `frontend-design`, `ui-ux-pro-max`, `emil-design-eng` pour les décisions visuelles. Garder les couleurs et polices validées sauf demande explicite. Pour documenter les règles, charger `create-design-md` et valider ses sorties.
3. **Écrire** : pour tout texte, charger `copywriting` puis `copy-editing`, lire `.agents/product-marketing.md` et vérifier chaque affirmation. Ne pas inventer d’avis, chiffres, labels, recettes, prix ou services.
4. **Construire** : préserver la stack. Charger `mobile-native` dès qu’une surface web change. Pour du mouvement, charger le skill Emil adapté (`animate`, `review-animations`, `animation-performance` ou `remove-animations`) ; éviter l’animation systématique.
5. **Auditer** : utiliser `impeccable` en mode refinement/audit/polish selon la tâche et `web-design-guidelines`. Rapporter les problèmes avec leur emplacement, sans corriger des éléments hors périmètre sous prétexte de goût.
6. **Tester** : `webapp-testing` pour les parcours ; `break-ui` pour les cas limites pertinents, dans des fixtures ou tests sans injecter de fausses données dans le site client. Vérifier les tailles nécessaires, le clavier, les images et le mouvement réduit. Réutiliser les scripts existants lorsque adaptés.
7. **Livrer** : décrire ce qui a changé, les contrôles réellement réussis et les limites ; déployer uniquement lorsque la demande le prévoit et conserver le domaine existant. Distinguer push GitHub, build Vercel et vérification publique.

Pour une question simple, ne pas lancer d’installations, d’audits ou de navigateur sans nécessité. « Systématique » signifie choisir et appliquer les bons skills à chaque étape, pas exécuter tous les outils à chaque message.
