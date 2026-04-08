# summer-body

Application mobile iPhone d'accompagnement à la perte de poids pilotée par Claude (Anthropic). Profil personnalisé, groupes multi-personnes, génération de plannings de repas via chat IA.

> Voir [`CLAUDE.md`](./CLAUDE.md) pour le contrat de collaboration et les conventions de code.
> Voir [`docs/design-system.md`](./docs/design-system.md) pour la direction visuelle.
> Voir [`docs/user-flows.md`](./docs/user-flows.md) pour les parcours utilisateurs du MVP.

## Stack

| Couche | Techno |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Mobile | React Native + Expo (TypeScript) — *à venir* |
| Backend | Node.js + TypeScript + Hono |
| DB | PostgreSQL + Drizzle ORM |
| Auth | Google OAuth (ID token) + JWT (jose) |
| IA | Claude Agent SDK (TypeScript) — *à venir* |
| Validation | Zod (schémas dans `packages/shared`) |
| Lint/Format | Biome 2 |
| Tests | Vitest |

## Structure

```
summer-body/
├── apps/
│   └── api/                  # Hono backend
└── packages/
    ├── shared/               # Zod schemas, enums, limits partagés
    └── nutrition/            # Calculs Mifflin-St Jeor, TDEE, target kcal
```

## Prérequis

- Node.js ≥ 20.10
- pnpm 9.x
- Docker (pour Postgres local)

## Installation

```bash
pnpm install
```

## Lancer en local

### 1. Postgres

```bash
docker compose up -d
```

### 2. Variables d'environnement

```bash
cp apps/api/.env.example apps/api/.env
```

À éditer dans `apps/api/.env` :

| Variable | Description |
|---|---|
| `DATABASE_URL` | OK par défaut si tu utilises le `docker-compose.yml` |
| `GOOGLE_OAUTH_CLIENT_ID` | Client ID OAuth Google (console.cloud.google.com) |
| `JWT_SECRET` | Secret long aléatoire (`openssl rand -hex 32`) |

### 3. Migrations

```bash
cd apps/api
pnpm db:generate    # génère la migration depuis schema.ts
pnpm db:migrate     # applique sur la DB
```

### 4. Démarrer l'API

```bash
pnpm dev            # depuis la racine
```

L'API écoute sur `http://localhost:3000`.

## Commandes

| Commande | Description |
|---|---|
| `pnpm dev` | Lance tous les workspaces en mode dev (turbo) |
| `pnpm build` | Build de tous les workspaces |
| `pnpm test` | Vitest sur tous les workspaces |
| `pnpm typecheck` | `tsc --noEmit` partout |
| `pnpm lint` | `biome check .` |
| `pnpm format` | `biome format --write .` |

## Endpoints API

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Healthcheck |
| POST | `/auth/google` | — | Vérifie un Google ID token, upsert user, renvoie un JWT |
| GET | `/me` | Bearer | Renvoie le user courant |

### Exemple

```http
POST /auth/google
Content-Type: application/json

{ "idToken": "<google-id-token>" }
```

Réponse :
```json
{
  "token": "<session-jwt>",
  "user": { "id": "...", "email": "...", "name": "...", "avatarUrl": "..." }
}
```

## Packages

### `@summer-body/shared`

Schémas Zod, enums et bornes partagés API ↔ mobile.

- `ProfileSchema`, `MaintenanceInputSchema`, `SportEntrySchema`, `CommuteHabitsSchema`, `KcalDeltaPercentSchema`
- Enums : `SEX_VALUES`, `ACTIVITY_LEVEL_VALUES`, `SPORT_INTENSITY_VALUES`, `COMMUTE_MODE_VALUES`
- Bornes : `MIN/MAX_AGE_YEARS`, `MIN/MAX_HEIGHT_CM`, `MIN/MAX_WEIGHT_KG`, `MIN/MAX_KCAL_DELTA_PERCENT`, presets `DEFAULT_KCAL_DELTA_LOSS_PERCENT`, `DEFAULT_KCAL_DELTA_GAIN_PERCENT`

### `@summer-body/nutrition`

Calculs purs, sans dépendance runtime.

- `mifflinStJeorBmr({ sex, ageYears, heightCm, weightKg })` → BMR (kcal/jour)
- `maintenanceKcal(input)` → BMR × facteur d'activité (TDEE)
- `targetKcal(maintenance, kcalDeltaPercent)` → TDEE × (1 + delta/100), delta signé en %
- Tests : 10 ✅

## Roadmap MVP

- [x] Monorepo + conventions (`CLAUDE.md`)
- [x] `packages/shared` (Zod schemas)
- [x] `packages/nutrition` (Mifflin-St Jeor + tests)
- [x] API : auth Google + JWT + `/me`
- [ ] API : profil utilisateur (`PUT /profile` avec recalcul `maintenanceKcal`)
- [ ] API : groupes + invitations
- [ ] API : chat Claude Agent SDK + tool use → génération de planning structuré
- [ ] Mobile : Expo + écrans onboarding / groupe / chat / planning
- [ ] Build iOS via EAS

## Licence

Privé.
