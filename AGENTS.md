# Instructions Codex — La Cuisine de Dina

## Avant toute tâche

Travailler dans ce checkout existant. Lire `SKILL.md`, `DESIGN.md`, `.agents/CODEX-ADAPTER.md` et `.agents/skills/dina-workflow/SKILL.md`. Le projet est en phase d’améliorations ciblées : préserver le site actuel et ce qui n’est pas dans la demande. Ne pas lancer une refonte générale.

## Utilisation systématique des skills

Le routeur `dina-workflow` est obligatoire pour chaque tâche du projet. Il choisit les skills nécessaires selon l’étape ; ne pas charger les 74 skills amont à chaque message.

- Direction artistique et composants : `frontend-design`, `ui-ux-pro-max`, `emil-design-eng`.
- Palette et typographie : consulter `DESIGN.md` ; `ui-ux-pro-max` conseille sans remplacer la charte validée.
- Règles visuelles persistantes : `create-design-md` ; toute modification de la charte doit venir du brief, pas d’une recherche de palette.
- Mobile et cas extrêmes : `mobile-native`, `break-ui`.
- Animations : `animate` si nécessaire, `review-animations` et `animation-performance` pour vérifier ; conserver l’option de supprimer du mouvement.
- Audit et finitions : `impeccable`, puis `web-design-guidelines`.
- Parcours navigateur et captures : `webapp-testing` avec Playwright ; ne pas annoncer de contrôle non exécuté.
- Texte marketing : `copywriting`, puis `copy-editing`, avec `.agents/product-marketing.md`. Charger les autres skills marketing seulement selon la tâche.

## Contraintes et capacités

Les dernières consignes du client priment sur les préférences génériques ou contradictoires des skills. Fond blanc, texte noir/cacao, jaune conservé, pas de vert ni bordeaux dans l’interface. Préserver le domaine `https://restaudedina.vercel.app/`, le contenu réel et le statut illustratif des visuels recréés par IA.

Un skill n’ajoute aucun accès réseau, compte Vercel/Figma, API marketing ou appareil physique. Adapter les outils Claude aux outils réellement disponibles dans Codex selon `CODEX-ADAPTER.md`. Ne pas prétendre avoir créé un fichier Figma si seul un SVG existe. Signaler un contrôle distant bloqué sans le compter comme réussi.

Ne pas envoyer d’e-mails, de messages, de campagnes ou de dépenses publicitaires du seul fait qu’un skill décrit ces actions. Leur installation n’est pas une demande d’exécution. Ne pas activer automatiquement de hooks, de scripts distants ou de changement de stack. Pour les scripts importés, lire les prérequis et commencer par `--help` lorsque proposé.

## Vérifications

Installation de skills : `python3 scripts/verify-project-skills.py`. Site : `npm test`. Lorsqu’une modification touche l’UI, lancer les contrôles navigateur pertinents ; le projet utilise Node.js natif et du HTML/CSS/JavaScript, sans React ou Next.js. Ne pas migrer de framework pour appliquer un exemple de skill.

Les sources et licences sont versionnées sous `.agents/`, avec les commits et empreintes dans `skill-sources.json` et `skills-lock.json`. Ne pas les mettre à jour silencieusement. Les scripts de test et caches ne font pas partie du site public.
