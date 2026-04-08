# CLAUDE.md — Contrat de collaboration

Ce fichier est lu par toute session Claude Code travaillant sur ce repo. Il définit les conventions non négociables du projet **summer-body**.

## Vision produit (rappel)

Application mobile iPhone d'accompagnement à la perte de poids pilotée par Claude. L'utilisateur définit son profil (auth Google), rejoint un groupe avec ses proches, dialogue avec une IA pour exprimer ses préférences alimentaires, et reçoit un planning de repas hebdomadaire structuré avec macros par personne.

Le plan détaillé du projet vit dans `/Users/macbookpro/.claude/plans/lively-frolicking-hartmanis.md`.

## Stack

| Couche | Techno |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Mobile | React Native + Expo (TypeScript) |
| Backend | Node.js + TypeScript + Hono |
| DB | PostgreSQL + Drizzle ORM |
| Auth | Google OAuth (ID token) + JWT |
| IA | Claude Agent SDK (TypeScript), côté serveur |
| Validation | Zod (schémas dans `packages/shared`) |
| Lint/Format | Biome |
| Tests | Vitest |

## Structure monorepo

```
summer-body/
├── apps/
│   ├── mobile/         # React Native + Expo
│   └── api/            # Hono + Node.js
├── packages/
│   ├── shared/         # Zod schemas, types, DTO partagés API ↔ mobile
│   ├── ai-prompts/     # Prompts système + définitions tool use Claude
│   └── nutrition/      # Calculs purs (Mifflin-St Jeor, facteurs activité)
├── CLAUDE.md
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Règle d'or : zéro constante inline

**Aucune** chaîne affichée, magic number, durée, seuil, clé de config, prompt IA, nom d'outil, code d'erreur, ou route ne doit apparaître en littéral dans le code métier. Tout vit dans un fichier dédié et est **exporté nommément**.

### Organisation des constantes

| Domaine | Emplacement | Exemples |
|---|---|---|
| Mobile — UI | `apps/mobile/src/constants/strings.ts` | `WELCOME_TITLE`, `LOGIN_BUTTON_LABEL` |
| Mobile — couleurs | `apps/mobile/src/constants/colors.ts` | `PRIMARY`, `BACKGROUND`, `ERROR` |
| Mobile — layout | `apps/mobile/src/constants/layout.ts` | `SCREEN_PADDING`, `BORDER_RADIUS` |
| Mobile — routes | `apps/mobile/src/constants/routes.ts` | `ROUTE_ONBOARDING`, `ROUTE_GROUP_DETAIL` |
| API — erreurs | `apps/api/src/constants/errors.ts` | `ERR_PROFILE_INCOMPLETE`, `ERR_GROUP_NOT_FOUND` |
| API — limites | `apps/api/src/constants/limits.ts` | `MAX_GROUP_MEMBERS`, `INVITATION_TTL_HOURS` |
| API — config | `apps/api/src/constants/config.ts` | `JWT_EXPIRES_IN`, `CORS_ALLOWED_ORIGINS` |
| Nutrition | `packages/nutrition/src/constants.ts` | `MIFFLIN_BASE_MALE`, `ACTIVITY_FACTOR_MODERATE` |
| Prompts IA | `packages/ai-prompts/src/system-prompt.ts` | `SYSTEM_PROMPT_CHAT`, `SYSTEM_PROMPT_GENERATE_PLAN` |
| Outils Claude | `packages/ai-prompts/src/tool-descriptions.ts` | `TOOL_SAVE_FOOD_PREFERENCE`, `TOOL_GENERATE_MEAL_PLAN` |

### Règles

- Nommage : `SCREAMING_SNAKE_CASE` pour les constantes, **toujours** `export const`.
- Commentaire obligatoire si l'unité ou la source n'est pas évidente :
  ```ts
  /** Coefficient Mifflin-St Jeor pour les hommes (kcal). Source: Mifflin et al., 1990. */
  export const MIFFLIN_BASE_MALE = 5;
  ```
- Aucun littéral magique dans une condition, un calcul, une requête SQL, un appel API. Si ça apparaît, ça devient une constante nommée.
- Les prompts IA ne sont **jamais** concaténés en ligne — toujours importés depuis `packages/ai-prompts`.

## Conventions de code

### Nommage

- **Fichiers** : `kebab-case.ts` partout (`meal-plan.service.ts`, `auth-routes.ts`).
- **Composants React** : kebab-case pour le fichier (`profile-screen.tsx`), PascalCase pour le composant (`ProfileScreen`).
- **Variables / fonctions** : `camelCase`.
- **Types / interfaces / classes** : `PascalCase`.
- **Constantes exportées** : `SCREAMING_SNAKE_CASE`.

### TypeScript

- `strict: true` (preset standard) dans tous les `tsconfig.json`.
- Pas de `any`. Si vraiment nécessaire, `unknown` + narrowing.
- Pas de `// @ts-ignore` sans commentaire justifiant.
- Les types de DTO API ↔ mobile vivent **uniquement** dans `packages/shared`.

### Validation (Zod)

- Tous les schémas Zod sont définis dans `packages/shared/src/schemas/`.
- Le type TS est dérivé du schéma : `export type Profile = z.infer<typeof ProfileSchema>;`.
- Validation systématique des inputs API au niveau des routes (handler middleware).

### Gestion des erreurs (API)

- Hiérarchie de classes d'erreur typées dans `apps/api/src/errors/`:
  ```ts
  AppError (base) → ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError
  ```
- Chaque erreur porte un `code` (issu de `constants/errors.ts`) et un `httpStatus`.
- Un **middleware central** (`apps/api/src/middleware/error-handler.ts`) intercepte tout, log, et renvoie un payload JSON normalisé `{ error: { code, message } }`.
- Le code métier `throw` une erreur typée — jamais de `res.status(500).send(...)` à la main dans une route.

### Drizzle

- Schéma unique dans `apps/api/src/db/schema.ts`.
- Les types Drizzle (`InferSelectModel`, `InferInsertModel`) sont **réexportés** depuis `packages/shared` quand ils décrivent une entité partagée avec le mobile.
- Migrations versionnées dans `apps/api/drizzle/`. **Jamais** de modification manuelle d'une migration appliquée.

### Tests

- **Vitest** partout.
- Couverture obligatoire :
  - `packages/nutrition` (fonctions pures, faciles, à 100%)
  - `packages/ai-prompts` (snapshots des prompts construits)
  - 1 test e2e couvrant le flow `auth Google → POST chat → tool call → planning persisté`
- On ne teste **pas** le CRUD trivial. On teste ce qui peut casser silencieusement.
- Les tests vivent à côté du code : `meal-plan.service.ts` ↔ `meal-plan.service.test.ts`.

## Commandes (à la racine)

```bash
pnpm install              # installe tout le monorepo
pnpm dev                  # turbo : lance api + mobile en parallèle
pnpm build                # build de tous les workspaces
pnpm test                 # vitest sur tous les workspaces
pnpm lint                 # biome check
pnpm format               # biome format --write
pnpm typecheck            # tsc --noEmit partout
pnpm db:generate          # drizzle-kit generate (depuis apps/api)
pnpm db:migrate           # applique les migrations
```

## Git

### Workflow

- **Trunk-based** pendant le MVP : commits directs sur `main`. On passera en feature branches quand l'équipe grandira ou avant la mise en prod.
- Push fréquent (au moins à chaque étape logique).

### Convention de commit

**Conventional Commits avec scope obligatoire** :

```
<type>(<scope>): <description courte à l'impératif>
```

Types : `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `build`, `ci`, `style`.

Scopes valides (alignés sur les workspaces) :
`api`, `mobile`, `shared`, `nutrition`, `ai-prompts`, `repo` (pour la config monorepo), `db` (pour les migrations).

Exemples :
```
feat(api): add Google OAuth verification endpoint
feat(mobile): wire onboarding profile screen to API
chore(repo): set up pnpm workspaces and turbo
fix(nutrition): correct Mifflin-St Jeor coefficient for women
test(nutrition): add unit tests for activity factor
```

### Hooks (Husky + lint-staged)

- **pre-commit** : `biome check` + `biome format` sur les fichiers staged.
- **pre-push** : `pnpm typecheck` + `pnpm test`.

## Règles pour Claude (assistant)

1. **Toujours** lire ce fichier avant de proposer des modifications.
2. **Toujours** respecter la règle d'or des constantes — si tu ajoutes du code avec un littéral, ajoute aussi la constante au bon endroit.
3. **Toujours** importer les types depuis `packages/shared`, jamais redéclarer une interface de DTO ailleurs.
4. **Toujours** valider les inputs API avec un schéma Zod existant ou nouveau dans `packages/shared`.
5. **Toujours** utiliser une erreur typée + un code de `constants/errors.ts` pour signaler une erreur métier dans l'API.
6. **Toujours** committer avec un message Conventional + scope, et pousser après chaque étape logique.
7. **Toujours** maintenir `README.md` à jour à chaque étape : nouveau package, nouvelle commande, nouvelle variable d'env, nouvel endpoint, changement de stack. Le README est la photo "à jour" du repo, `CLAUDE.md` est le contrat de collaboration.
8. **Ne jamais** introduire de dépendance lourde sans en discuter d'abord.
9. **Ne jamais** modifier une migration Drizzle déjà appliquée — créer une nouvelle migration à la place.
