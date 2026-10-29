# Adaptation des skills à Codex

## Portée

Les skills sont installés pour **ce dépôt** dans `.agents/skills/<nom>/SKILL.md`, emplacement de découverte des skills locaux Codex. Dans la session d’installation, les fichiers sont consultables explicitement ; le catalogue d’un client déjà démarré peut nécessiter une nouvelle session pour les afficher. Aucune installation globale n’a été effectuée dans les dossiers utilisateur protégés.

Les fichiers `UPSTREAM-SKILL.md` conservent les instructions originales. Les `SKILL.md` actifs ajoutent cet adaptateur ; les chemins du plugin Claude de UI UX Pro Max ont été remplacés par des chemins locaux. Les marqueurs `disable-model-invocation: true` ont été retirés des copies actives pour autoriser le routage systématique demandé. La source originale et les licences restent conservées.

## Outils

| Référence dans un skill | Équivalent dans cette session Codex |
|---|---|
| Read / Edit / Write | Lecture de fichiers et `apply_patch` via les outils d’exécution disponibles |
| Glob / Grep | `rg --files` / `rg` |
| Bash / Terminal | `exec_command` ; conserver le code de sortie réel |
| WebFetch / WebSearch | Outil web connecté si disponible, sinon requête HTTPS via le proxy autorisé ; ne pas déclarer un accès réussi si refusé |
| Browser / Playwright | Playwright Node et Chromium fournis ; ou Python Playwright si installé ; aucune session de navigateur n’est supposée connectée à un compte |
| AskUserQuestion | Question concise seulement si une information bloque réellement le travail ; réutiliser le brief existant |
| Task / sous-agents | Uniquement si les instructions de la session et la tâche autorisent la délégation ; la simple installation ne la déclenche pas |
| Plugin / MCP externe | Découvrir les outils présents ; une commande écrite dans un skill ne crée pas de connecteur |

## Résoudre les chemins et prérequis

Exécuter depuis la racine du dépôt ou construire un chemin absolu depuis celle-ci. Ne pas dépendre de `CLAUDE_PLUGIN_ROOT`, de `~/.claude` ou d’un répertoire `/tmp` d’une ancienne session.

- UI UX Pro Max : `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "keyboard focus modal" --domain ux`. Python standard, données locales incluses. Recommandations à confronter à `DESIGN.md` ; ne pas utiliser `--persist` pour remplacer la charte.
- Impeccable : `sh scripts/skill-impeccable.sh context`. Le lanceur officiel télécharge un moteur épinglé puis vérifie son SHA-256 contre le manifeste distribué avec le skill. Cache local ignoré `.cache/skills/impeccable/`. Ne jamais désactiver cette vérification. Aucun hook activé automatiquement. Si le moteur ne fonctionne pas, appliquer le mode de lecture directe des références prévu par le skill et signaler que le moteur n’a pas été exécuté.
- DESIGN.md : `sh scripts/skill-design-md.sh lint DESIGN.md`, puis `sh scripts/skill-design-md.sh export --format dtcg DESIGN.md`. CLI `@google/design.md` épinglée ; cache npm local ignoré. Ne pas ajouter Tailwind ou changer le CSS pour satisfaire un exemple d’export.
- Webapp-testing : `python3 .agents/skills/webapp-testing/scripts/with_server.py --help`. Le helper gère un serveur et sa commande enfant ; pour le projet, réutiliser Playwright Node et `scripts/check-browser.cjs`. Pour une exécution isolée, le runner du projet peut être exécuté directement ou avec `scripts/skill-browser-smoke.cjs`, sans modifier l’application.
- Marketing : les documents et CLI auxiliaires du dépôt sont conservés dans `.agents/marketing-tools/`. Traduire les exemples `node tools/clis/...` en `node .agents/marketing-tools/clis/...` depuis la racine. Les actions API restent conditionnées à un connecteur, des accès valides et une demande explicite. Ne pas demander de secrets dans le chat.

## Résoudre les conflits

Ordre de décision : instructions de la session et demande du client, `AGENTS.md` et charte acceptée, skill spécialisé pertinent, recommandations générales. Un guide de goût ne remplace pas les faits du restaurant. Une règle native iOS/Expo/Swift n’impose pas de transformer le site en application native.

Préférer une amélioration isolée, expliquer son bénéfice, vérifier le résultat rendu, puis poursuivre la demande. Les salutations anglaises et menus d’aide proposés par certains skills ne doivent pas interrompre une tâche concrète déjà demandée.
