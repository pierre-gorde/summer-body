# Design System — Soft Wellness

Direction visuelle de **summer-body**. Source de vérité pour les choix de palette, typographie, espacements et composants. À porter dans `apps/mobile/src/constants/` quand l'app sera créée.

## Identité

**Mood** : chaleureux, bienveillant, motivant sans être culpabilisant. On accompagne quelqu'un dans sa perte de poids — l'app doit donner envie d'ouvrir, pas l'impression d'être surveillé. Ton d'un coach attentionné, pas d'un entraîneur militaire.

**Inspirations majeures**
- *Harmonizing Health (Tino)* — base wellness pastel et typographie éditoriale
- *DocSpot (Phenomenon)* — structure, hiérarchie et whitespace
- *Paperpillar (Prakthis)* — pattern de chat IA avec cards interactives in-line

## Palette

### Fond et neutres

| Token | Hex | Usage |
|---|---|---|
| `BG_BASE` | `#FAF6F0` | Crème très clair, fond global de l'app |
| `BG_CARD` | `#FFFFFF` | Cards principales |
| `BG_SUNKEN` | `#F2EDE5` | Sous-fonds, états désactivés |
| `INK_PRIMARY` | `#1F1B16` | Texte principal (presque noir, jamais pur) |
| `INK_SECONDARY` | `#6B6259` | Texte secondaire |
| `INK_MUTED` | `#A39A8F` | Placeholder, labels |

### Pastels d'accent

| Token | Hex | Usage |
|---|---|---|
| `PASTEL_SAGE` | `#E8F0E5` | Cards "objectif atteint", repas validés, bulles user du chat |
| `PASTEL_PEACH` | `#FCEAD9` | Cards repas "déjeuner" |
| `PASTEL_LAVENDER` | `#ECE6F5` | Cards repas "dîner" |
| `PASTEL_CREAM` | `#FFF3DD` | Cards repas "collation" |
| `PASTEL_SKY` | `#E2EEF5` | Cards info / IA |

### Couleurs d'action

| Token | Hex | Usage |
|---|---|---|
| `ACCENT_PRIMARY` | `#4A6B4F` | Vert sauge profond — CTA principal, liens, état actif |
| `ACCENT_PRIMARY_HOVER` | `#3A5640` | Pressed state |
| `ACCENT_WARM` | `#C66B4F` | Terracotta — accent secondaire, alertes douces |
| `SUCCESS` | `#5C8A5F` | Validations, confirmations |
| `DANGER` | `#B85450` | Erreurs (rare, jamais alarmant) |

> **Pourquoi le vert sauge plutôt que le noir** : noir + bouffe = trop austère. Le vert profond garde la lisibilité du contraste, ajoute la dimension "nature/santé" sans tomber dans le vert pomme cliché healthcare.

## Typographie

**Famille principale** : **Inter** (gratuite, lisible, supporte le gras éditorial). Alternative : Geist.

| Token | Taille / poids | Usage |
|---|---|---|
| `display-xl` | 56px / 800 | Chiffre héros (kcal du jour) |
| `display-lg` | 40px / 700 | Titre d'écran |
| `display-md` | 28px / 700 | Sous-titre, nom de repas |
| `body-lg` | 17px / 500 | Corps mis en avant, boutons |
| `body` | 15px / 400 | Corps standard |
| `caption` | 13px / 500 | Métadonnées |
| `label` | 11px / 600 / uppercase / +0.05em | Tags catégorie |

Pour les `display-*`, tracking légèrement serré : `-0.02em`.

## Espacements et formes

- **Grille** : 4px de base — multiples 4 / 8 / 12 / 16 / 24 / 32 / 48
- **Padding écran** : 20px latéral, 24px vertical
- **Card radius** : 24px (grandes cards), 16px (chips), 999px (boutons en pilule)
- **Espacement entre cards** : 12px
- **Ombre standard** : `0 4px 16px rgba(31, 27, 22, 0.04)` — quasi imperceptible, juste un soulèvement

## Composants clés

### Bouton primaire

- Pilule, hauteur 56px, padding horizontal 32px
- Fond `ACCENT_PRIMARY`, texte `BG_BASE`
- Texte 17px / 600
- Pas d'ombre, juste l'aplat

### Bouton secondaire

- Même forme, fond `BG_CARD`, bord 1px `BG_SUNKEN`, texte `INK_PRIMARY`

### Card "membre de groupe"

- Fond blanc, radius 24px, padding 20px
- Avatar rond 56px à gauche
- Nom (`display-md`) + objectif (`1850 kcal/jour`) en `caption`
- Trait coloré (3px de large) sur le côté gauche selon une couleur attribuée au membre

### Card "repas du jour"

- Fond pastel selon le slot :
  - Déjeuner → `PASTEL_PEACH`
  - Dîner → `PASTEL_LAVENDER`
  - Collation → `PASTEL_CREAM`
- Header : icône slot + nom du repas (`display-md`)
- Liste d'ingrédients en `body`, le poids en `caption` muted
- Footer : kcal + protéines en grands chiffres `display-md`

### Bulle chat — utilisateur

- Fond `PASTEL_SAGE`, alignée à droite
- Radius asymétrique : `24/24/4/24`
- Padding 16px

### Bulle chat — assistant

- Fond `BG_CARD` + ombre standard, alignée à gauche
- Radius asymétrique : `24/24/24/4`

### Mini-card "préférence enregistrée" (in-chat)

- Apparaît dans une bulle assistant, fond `PASTEL_SAGE`
- Icône check + label de la préférence
- Bouton "Modifier" en lien discret

### Mini-card "planning généré" (in-chat)

- Fond `PASTEL_LAVENDER`, radius 24px
- Titre "Planning du X au Y"
- Sous-titre "5 jours · 10 repas"
- CTA "Voir le détail →" qui navigue vers l'écran planning

### Input chat

- Pilule large, fond blanc, ombre douce
- Mic à droite, send rond `ACCENT_PRIMARY` à droite extrême
- Placeholder : "Dis-moi ce que tu veux manger…"

### Bottom navigation

- 4 onglets : **Aujourd'hui · Groupe · Chat · Profil**
- Le bouton **Chat** est légèrement surélevé (pilule centrale, action principale)
- Icônes outline 24px, label 11px
- État actif : pilule pastel `PASTEL_SAGE` derrière l'icône

### Progress bar

- Hauteur 8px, radius 999px
- Track : `BG_SUNKEN`, fill : `ACCENT_PRIMARY`
- Animation de remplissage doux à l'apparition (`ease-out`, ~600ms)

## Animations et micro-interactions

L'app doit être **doux + motivant**. Les animations sont discrètes mais présentes :

- **Progress bars** : remplissage progressif `ease-out` 600ms
- **Apparition de cards** : fade-in + translate-y de 8px, 300ms
- **Tap sur bouton** : scale 0.97 puis retour, 150ms
- **Objectif atteint** : mini-confetti pastel (5 particules sage/peach/lavender), 1s, jamais bruyant
- **Transitions d'écran** : push iOS natif, pas de fancy
- **Validation IA** : check qui se dessine en SVG (stroke-dashoffset), 400ms
