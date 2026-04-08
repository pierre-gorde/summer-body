# User Flows — MVP

Parcours utilisateurs du MVP de **summer-body**. Source de vérité pour la navigation, les écrans à construire et les règles produit.

## Décisions produit

| Décision | Choix |
|---|---|
| Onboarding profil | **Obligatoire et complet** (4 étapes) avant d'accéder à l'app |
| Mode solo | **Groupe "solo" auto-créé** à l'inscription — l'app n'a jamais à gérer le cas "pas de groupe" |
| Invitations | **Lien partageable** (universal link / deep link) — partagé via n'importe quel canal (WhatsApp, SMS, email…) |
| Affichage planning | **Card-résumé dans le chat** + écran détail dédié au tap |
| Chat IA | **Onglet central surélevé** dans la bottom nav (pas de FAB persistant en v1) |

## Architecture de navigation

```
Bottom Tab Navigator
├── Aujourd'hui   (home)
├── Groupe        (membres + invitation)
├── Chat          (onglet central surélevé)
└── Profil        (mesures, sport, objectif, déconnexion)
```

Stacks empilés au-dessus :
- Onboarding (modal full-screen, gating)
- Détail planning (push depuis Chat ou Aujourd'hui)
- Édition profil (modal)
- Acceptation d'invitation (deep link → modal)

---

## Flow 1 — Onboarding

```
Splash logo
  ↓
Écran de bienvenue
  Titre : "summer-body"
  Sous-titre : "ton coach nutrition, en groupe"
  CTA primaire : [Continuer avec Google]
  ↓
OAuth Google natif iOS
  ↓ (POST /auth/google)
Profil 1/4 — Toi
  Sexe (chips H/F)
  Date de naissance (date picker)
  Taille en cm (slider 100-250)
  Poids en kg (slider 30-300)
  → [Suivant]
  ↓
Profil 2/4 — Ton activité
  Niveau d'activité général (5 chips empilés avec descriptions)
  - Sédentaire
  - Légère
  - Modérée
  - Active
  - Très active
  → [Suivant]
  ↓
Profil 3/4 — Tes sports
  Liste vide + bouton [+ Ajouter un sport]
  Modal d'ajout : type (texte), fréquence/sem, durée min, intensité
  Skip possible si rien à ajouter
  → [Suivant]
  ↓
Profil 4/4 — Ton objectif
  3 chips de raccourci en haut :
    [Perdre]   [Maintenir]   [Prendre]
  Tap "Perdre"   → presets kcalDeltaPercent à -10
  Tap "Maintenir"→ presets kcalDeltaPercent à 0
  Tap "Prendre"  → presets kcalDeltaPercent à +10

  Slider en dessous :
    Plage : -50% ↔ +50% (par défaut sur la valeur du preset choisi)
    Le pourcentage exact est affiché en gros au-dessus du slider
    ex: "-10 %  (déficit doux)"

  Affichage en temps réel sous le slider :
    "Maintien : 2200 kcal/jour"
    "Objectif : 1980 kcal/jour"
  → [Valider]
  ↓ (PUT /profile)
Bienvenue
  "Bienvenue Pierre 🌿
  Ton maintien est de 2200 kcal/jour
  Ton objectif est de 1850 kcal/jour"
  CTA primaire : [C'est parti]
  ↓
(Aujourd'hui — home)
```

À l'inscription, le backend crée automatiquement un **groupe solo** dont l'utilisateur est l'unique membre et propriétaire. Le chat parle toujours à un groupe — pas de cas particulier.

---

## Flow 2 — Inviter quelqu'un dans son groupe

```
Aujourd'hui → tap onglet "Groupe"
  ↓
Détail groupe
  Header : nom du groupe + N membres
  Liste des membres en cards
  CTA primaire : [Inviter quelqu'un]
  ↓
Inviter
  Texte : "Partage ce lien à la personne que tu veux inviter."
  Card avec le lien généré (ex: https://summer-body.app/invite/abc123)
  Bouton [Copier le lien]
  Bouton [Partager…] (sheet iOS native — WhatsApp/SMS/Mail/etc.)
  ↓
(L'invitation est créée côté API avec un token unique et une expiration)
```

### Côté invité

```
Réception du lien (n'importe quel canal)
  ↓
Tap sur le lien → universal link iOS
  ↓
Si app pas installée : redirection App Store
Si installée : ouverture de l'app
  ↓
Si pas auth : Flow 1 (auth + onboarding)
  ↓
Modal acceptation
  Avatar du sender + texte :
  "Pierre t'invite à rejoindre le groupe Pierre & Elena"
  CTA primaire : [Rejoindre]
  CTA secondaire : [Refuser]
  ↓
(POST /groups/{id}/accept-invitation)
  ↓
Détail groupe (avec Pierre + Elena)
```

---

## Flow 3 — Premier chat IA → planning

```
Aujourd'hui → tap onglet central "Chat"
  ↓
Chat (vide)
  Bulle assistant :
  "Salut Pierre 🌿 Pour te proposer un planning, dis-moi
   comment tu veux manger cette semaine. Genre :
   'pas de petit-déj', 'j'aime les poissons',
   'je cuisine pas le mardi soir'…"
  ↓
User tape un message libre :
  "Pas de petit-déj. En collation soit sucrine assaisonnée
   soit barre Koro. J'aime le poisson grillé."
  ↓
(API streaming — l'IA appelle plusieurs fois `save_food_preference`)
  ↓
Réponse assistant :
  "Noté ! J'ai enregistré 3 préférences :"
  [Mini-card sage] ✓ Pas de petit-déjeuner
  [Mini-card sage] ✓ Collations : sucrine ou barre Koro
  [Mini-card sage] ✓ Préférence : poisson grillé

  "Tu veux que je te génère un planning pour cette semaine ?"
  Bouton suggéré : [Oui, génère le planning]
  ↓
Tap sur le bouton suggéré
  ↓
(L'IA appelle `generate_meal_plan` — 10-30s avec indicateur de génération)
  ↓
Réponse assistant :
  "Voilà, j'ai préparé ta semaine 🌿"
  [Mini-card lavender — interactive]
  ┌──────────────────────────┐
  │ Planning du 8 au 14 avril│
  │ 5 jours · 10 repas       │
  │ [Voir le détail →]       │
  └──────────────────────────┘
  ↓
Tap sur la card → Flow 4
```

---

## Flow 4 — Consulter et naviguer dans un planning

```
Détail planning (push)
  Header :
  - Titre : "Semaine du 8 au 14 avril"
  - Bouton retour
  - Sélecteur jour horizontal scrollable : L M M J V
    (le jour actuel pré-sélectionné)
  ↓
Si plusieurs membres dans le groupe :
  Tabs membres juste en dessous : [Pierre] [Elena]
  Sinon : vue directe sans tab
  ↓
Vue jour (mardi pour Pierre)
  Card "Total mardi"
    1932 kcal (display-xl en sage)
    P 142g · L 68g · G 198g
    Progress bar contre l'objectif (target_kcal de Pierre)
  ↓
  Card peach — Déjeuner
    "Salade composée"
    • Thon égoutté 250g
    • Riz blanc cuit 280g
    • Tomates cerises 100g
    ...
    Footer : 977 kcal · 77g P
  ↓
  Card lavender — Dîner
    "Bar vapeur + brocolis rôtis + riz basmati"
    ...
  ↓
  Card cream — Collation
    ...
  ↓
  Bouton secondaire : [Demander une modif au chat]
  → Ouvre le Chat avec contexte "Modifier le planning du 8-14 avril"
```

---

## Flow 5 — Modifier son profil

```
Aujourd'hui → tap onglet "Profil"
  ↓
Profil
  Avatar + nom + email
  Card "Ton maintien"  : 2200 kcal/jour (display-md)
  Card "Ton objectif"  : 1850 kcal/jour
  Card "Tes mesures"   : 178 cm · 78 kg
  Card "Tes sports"    : Course 3x/sem · Musculation 2x/sem
  [Modifier mes mesures]
  [Modifier mes sports]
  [Changer mon objectif]
  [Se déconnecter]
  ↓
Tap "Modifier mes mesures"
  ↓
Modal slider taille/poids
  → [Enregistrer]
  ↓ (PUT /profile)
(Recalcul automatique de maintenance_kcal et target_kcal côté serveur)
  ↓
Retour profil avec valeurs à jour

Tap "Changer mon objectif"
  ↓
Modal avec les mêmes contrôles que l'étape 4 de l'onboarding
(chips Perdre/Maintenir/Prendre + slider %)
  → [Enregistrer]
  ↓ (PUT /profile)
(Recalcul automatique de target_kcal côté serveur)
```

---

## Routes API qui découlent de ces flows

| Méthode | Route | Status | Flow |
|---|---|---|---|
| POST | `/auth/google` | ✅ | 1 |
| GET | `/me` | ✅ | toutes |
| PUT | `/profile` | TODO | 1, 5 |
| POST | `/groups` | TODO (auto-créé à l'auth) | 1 |
| GET | `/groups/me` | TODO | 2, 3, 4 |
| POST | `/groups/{id}/invitations` | TODO | 2 |
| POST | `/invitations/{token}/accept` | TODO | 2 |
| GET | `/chat/sessions` | TODO | 3 |
| POST | `/chat/sessions` | TODO | 3 |
| POST | `/chat/sessions/{id}/messages` | TODO (SSE stream) | 3 |
| GET | `/meal-plans/{id}` | TODO | 4 |
| GET | `/groups/{id}/meal-plans` | TODO | 4 |
