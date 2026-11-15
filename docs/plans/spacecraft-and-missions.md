# Plan : satellites et trajectoires de missions sur la page Solar system

## Contexte

La page `solar-system.html` montre le Soleil, les planètes et la Lune à leurs vraies positions entre 1800 et 2050, avec une liste d'événements (éclipses, conquête spatiale). Les événements de conquête spatiale (Sputnik, Gagarine, Apollo 11, Hubble, Curiosity, James Webb) n'affichent aujourd'hui que la planète concernée : on ne voit pas l'engin. La fonctionnalité ajoute une dizaine de satellites célèbres autour de la Terre et les trajectoires des grandes missions, avec un vaisseau qui avance sur sa trajectoire quand le temps défile. Public : enfants de 7 à 12 ans, toutes langues, interface en anglais.

## Ce qui existe déjà

- Horloge simulée et vitesses : `src/modules/solar-system/core/simulation-clock.ts`, `src/modules/solar-system/ui/clock.view.ts`.
- Échelles d'affichage `easy` / `real` : `src/modules/solar-system/ui/nodes/display-scale.ts` (rayons agrandis, Lune placée à 0,5 unité en vue facile), conversion écliptique vers scène : `src/modules/solar-system/core/scene-scale.ts` (7 unités par UA).
- Position de la Lune : `src/modules/solar-system/core/moon-orbit.ts` (`geocentricMoonPosition`, en rayons terrestres, repère écliptique J2000).
- Corps cliquables : `src/modules/solar-system/ui/nodes/sized-body.ts` (`FocusTarget`, étiquette nom + bouton « i »), caméra qui suit : `src/modules/solar-system/ui/camera-follow.ts`, navigation : `src/modules/solar-system/ui/navigation.view.ts`.
- Fiche d'infos : `src/modules/solar-system/ui/info/` (rendu), `src/modules/solar-system/core/info/body-facts.ts` (données), formats dans `info-format.ts`.
- Événements : `src/modules/solar-system/core/sky-events.ts` (`SkyEvent.focus: CelestialBodyId`), liste : `src/modules/solar-system/ui/events.view.ts`, branchement : `src/modules/solar-system/ui/page-controls.view.ts`.
- Seuil « trop rapide pour l'œil » (¼ de tour par image) : `spinBlurDuring` dans `src/modules/solar-system/core/spin.ts`.
- Données statiques servies par Vite depuis `public/data/` (exemple : `stars.json`, chargé par `src/modules/solar-system/infra/star-catalog.ts`).
- Règles de couches (`ui` → `core`, `infra` → types de `core`) imposées par ESLint (`eslint.config.mjs`).

## Ce qui manque

- Une échelle d'affichage pour les distances autour de la Terre : en vue facile, la Terre a un rayon de 0,32 unité et la Lune est à 0,5 unité, donc un satellite GPS (4,2 rayons terrestres) placé à l'échelle de la Terre passerait au-delà de la Lune.
- Un type de cible de caméra et de fiche qui ne soit pas un astre.
- Des données d'orbites de satellites et de trajectoires de sondes.
- Un lien entre un événement et un engin.

## Concepts clés

- **Satellite** : engin en orbite autour de la Terre, présent dans la scène de son lancement jusqu'à la fin de la plage simulée (aucun des satellites retenus n'est rentré dans l'atmosphère). Position calculée par une orbite képlérienne avec dérive due à l'aplatissement de la Terre (J2), à partir d'éléments mesurés à une date de référence (époque). L'orbite affichée est fidèle ; la position le long de l'orbite est précise à quelques minutes près dans les jours qui entourent l'époque, puis représentative.
- **Mission** : engin qui a un début et une fin (`window`). Sa trajectoire n'est affichée que pendant cette fenêtre : ligne en pointillé sur tout le trajet, et marqueur du vaisseau à sa position du moment.
- **Repère d'une mission** : `earth` (trajectoire autour de la Terre, attachée à la Terre qui se déplace) ou `sun` (trajectoire dans le système solaire).
- **Cible** (`FocusTarget`) : tout ce que la caméra peut suivre et qui a une fiche : un astre ou un engin.

## Dépendances inter-features

Aucune.

---

## Partie 1 — Satellites célèbres autour de la Terre

### 1.1 — Satellites autour de la Terre, cliquables, avec leur fiche (7.5h)

#### Fichiers à créer

```
src/modules/solar-system/core/spacecraft/spacecraft-ids.ts      # SatelliteId, MissionId, SpacecraftId, FocusId
src/modules/solar-system/core/spacecraft/satellites.ts          # catalogue des 10 satellites (nom, rôle, lancement, éléments)
src/modules/solar-system/core/spacecraft/orbits/earth-orbit.ts         # propagation Kepler + J2, période, vitesse, altitude
src/modules/solar-system/core/spacecraft/orbits/equatorial.ts          # passage équatorial J2000 vers écliptique J2000
src/modules/solar-system/core/info/satellite-facts.ts           # données de la fiche d'un satellite
src/modules/solar-system/ui/nodes/geocentric-scale.ts           # distance d'affichage autour de la Terre
src/modules/solar-system/ui/spacecraft/spacecraft-marker.ts          # marqueur à taille fixe à l'écran + étiquette nom / « i »
src/modules/solar-system/ui/spacecraft/satellites/satellite.node.ts             # marqueur + ligne d'orbite d'un satellite
src/modules/solar-system/ui/info/spacecraft/satellite-sections.ts          # sections de la fiche satellite
```

#### Fichiers à modifier

```
src/modules/solar-system/ui/nodes/display-scale.ts      # moonSceneOffset en vue facile passe par geocentric-scale
src/modules/solar-system/ui/nodes/sized-body.ts         # FocusTarget devient une union astre / engin ; createLabel exporté
src/modules/solar-system/ui/solar-system.bodies.ts      # crée les nœuds satellites sous earth.holder, expose leurs cibles
src/modules/solar-system/ui/navigation.view.ts          # flyToBody(id: CelestialBodyId) devient flyTo(id: FocusId)
src/modules/solar-system/ui/info/info.view.ts           # choisit la fiche selon le type de cible
src/modules/solar-system/ui/info/info-content.ts        # renderFactsSheet accepte une cible engin
src/modules/solar-system/core/sky-events.ts             # SkyEvent.focus: FocusId ; « Hubble telescope launched » vise 'hubble'
src/modules/solar-system/ui/page-controls.view.ts       # navigation.flyTo(event.focus)
src/styles.css                                          # style des étiquettes d'engins (plus petites que celles des planètes)
CHANGELOG.md, CHANGELOG.fr.md, RELEASES.md, RELEASES.fr.md
```

#### Détails

Satellites retenus (numéro NORAD pour CelesTrak, date de lancement UTC, rôle affiché) :

| Id | Nom affiché | NORAD | Lancement | Rôle (fiche) |
|---|---|---|---|---|
| `iss` | ISS | 25544 | 1998-11-20 06:40 | Astronauts live and work here. |
| `hubble` | Hubble | 20580 | 1990-04-24 12:33 | A telescope above the air. |
| `tiangong` | Tiangong | 48274 | 2021-04-29 03:23 | China's space station. |
| `gps` | GPS III-1 | 43873 | 2018-12-23 13:51 | Tells your phone where you are. |
| `galileo` | Galileo | 37846 | 2011-10-21 10:30 | Europe's satellite navigation. |
| `noaa-20` | NOAA-20 | 43013 | 2017-11-18 09:47 | Watches the weather from pole to pole. |
| `landsat-9` | Landsat 9 | 49260 | 2021-09-27 18:12 | Takes pictures of the land. |
| `sentinel-2a` | Sentinel-2A | 40697 | 2015-06-23 01:51 | Watches forests, fields and coasts. |
| `terra` | Terra | 25994 | 1999-12-18 18:57 | Studies the air, land and oceans. |
| `starlink` | Starlink | 44713 | 2019-11-11 14:56 | Brings the internet from space. |

- Éléments orbitaux : copiés une fois depuis les données GP de CelesTrak (format OMM) à une même époque, pour chaque NORAD, dans `satellites.ts` : époque (ms UTC), demi-grand axe (km, déduit du mouvement moyen), excentricité, inclinaison, ascension droite du nœud, argument du périgée, anomalie moyenne (degrés). Aucun appel réseau à l'exécution. La date de copie est notée en commentaire du catalogue.
- Propagation (`earth-orbit.ts`) : anomalie moyenne avancée du mouvement moyen, équation de Kepler résolue par Newton (au plus 8 itérations, tolérance 1e-10), dérives séculaires J2 du nœud et du périgée (J2 = 1,08263e-3, rayon équatorial 6378,137 km, μ = 398600,4418 km³/s²). Position dans le repère équatorial J2000, puis passage en écliptique J2000 par rotation autour de l'axe x de l'obliquité (23,4392911°), même repère que la Lune.
- Un satellite n'est affiché qu'à partir de sa date de lancement. Avant, son marqueur, son étiquette et son orbite sont cachés ; s'il est suivi par la caméra au moment où il disparaît (retour dans le temps), la caméra revient sur la Terre.
- Distance d'affichage autour de la Terre (`geocentric-scale.ts`), une seule fonction pour la Lune, les satellites et les missions autour de la Terre :
  - échelle réelle : distance en km × unités de scène par km (comme aujourd'hui pour la Lune) ;
  - vue facile : `R + (L - R) × ln(1 + h / 500) / ln(1 + hL / 500)`, avec `R` le rayon affiché de la Terre (0,32), `L` la distance affichée de la Lune (0,5), `h` l'altitude en km, `hL` l'altitude moyenne de la Lune (384 400 - 6371 km). L'ISS (420 km) passe à 0,337, un GPS (20 200 km) à 0,421, la Lune à 0,5 ± 0,002. La fonction est croissante : l'ordre des distances est toujours respecté.
  - `moonSceneOffset` en vue facile utilise cette fonction au lieu de la distance fixe 0,5, ce qui garde une source unique pour tout ce qui tourne autour de la Terre.
- Marqueur (`spacecraft-marker.ts`) : un point de 6 px à taille fixe à l'écran (`PointsMaterial`, `sizeAttenuation: false`), couleur `--signal-cyan` pour les satellites, avec l'étiquette nom + « i » existante (classe modificatrice `planet-label--spacecraft`).
- Ligne d'orbite : ellipse de 128 points recalculée à chaque image dans un tampon préalloué (le nœud et le périgée dérivent avec J2), opacité 0,25.
- Lisibilité :
  - les satellites (marqueurs, étiquettes, orbites) ne sont visibles que lorsque la caméra est à moins de 12 rayons affichés de la Terre, pour ne pas recouvrir l'étiquette de la Terre en vue d'ensemble ;
  - si un satellite fait plus d'¼ de tour d'orbite pendant une image (même seuil que le flou de rotation), son marqueur est caché et seule son orbite reste affichée.
- Caméra : un satellite suivi est vu avec un rayon de cible égal à 5 % du rayon affiché de la Terre.
- Fiche satellite (bouton « i ») : nom, rôle, date de lancement, altitude actuelle (km), vitesse actuelle (km/h), durée d'un tour de la Terre, nombre de tours par jour. Les formats existants de `info-format.ts` sont réutilisés.
- `FocusTarget` devient `{ kind: 'body'; bodyId: SizedBodyId } | { kind: 'spacecraft'; spacecraftId: SpacecraftId }` plus les champs communs actuels (nom, objet, rayon, étiquette, bouton « i »). Le code qui lisait `bodyId` filtre d'abord sur `kind === 'body'`.
- Événement « Hubble telescope launched » : sa cible passe de `earth` à `hubble`, la caméra arrive sur Hubble juste après sa mise en orbite.

#### Modèle de données

Aucune persistance. Types de domaine :

```ts
type SatelliteId = 'iss' | 'hubble' | 'tiangong' | 'gps' | 'galileo' | 'noaa-20'
  | 'landsat-9' | 'sentinel-2a' | 'terra' | 'starlink';

type EarthOrbitElements = {
  epoch: number;                 // ms UTC
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDegrees: number;
  ascendingNodeDegrees: number;
  periapsisArgumentDegrees: number;
  meanAnomalyDegrees: number;
};

type Satellite = {
  id: SatelliteId;
  name: string;
  role: string;
  launch: number;                // ms UTC
  orbit: EarthOrbitElements;
};
```

#### Statuts et transitions

Aucun.

#### Erreurs exposées

Aucune.

#### Migration et rétrocompatibilité

`FocusTarget`, `SkyEvent.focus` et `Navigation.flyToBody` changent de forme ; tous leurs usages sont internes à `src/modules/solar-system/` et basculent dans la même sous-partie. En vue facile, la distance de la Lune varie désormais de ±0,002 unité autour de 0,5 au lieu d'être fixe.

#### Architecture

- `core/spacecraft/` : types, catalogue, propagation, aucune dépendance vers `ui/` ni vers three.js.
- `ui/nodes/` : objets three.js et passage aux distances affichées. `geocentric-scale.ts` est à côté de `display-scale.ts`, qu'il complète.
- Le dossier `core/` dépasse 10 fichiers : les nouveaux fichiers vont dans le sous-dossier `core/spacecraft/`.

#### Sécurité

Aucune donnée utilisateur, aucun appel réseau, aucun secret.

#### Tests

Le projet n'a ni tests ni outil de test. Vérification manuelle, dans `pnpm dev` :
- ISS à environ 420 km et 92 min par tour dans la fiche, à la date d'époque du catalogue ;
- GPS III-1 visiblement plus loin que l'ISS et plus près que la Lune ;
- satellites absents avant leur date de lancement.

Puis `pnpm type-check` et `pnpm lint`.

#### Observabilité

Aucune.

#### Performance

10 résolutions de Kepler et 10 × 128 points d'orbite par image, dans des tampons préalloués : négligeable. Aucun fichier à charger.

#### Accessibilité

Étiquettes boutons avec `aria-label` « Go to ISS » / « Facts about ISS », accessibles au clavier comme celles des planètes. Le marqueur n'est jamais la seule cible cliquable : l'étiquette l'est. Avec `prefers-reduced-motion`, l'horloge démarre arrêtée et les satellites sont immobiles.

#### Critères d'acceptation

- En zoomant sur la Terre, les 10 satellites apparaissent avec leur nom, chacun sur son orbite, l'ISS tout près de la surface et le GPS loin, sans jamais dépasser la Lune.
- Un clic sur le nom d'un satellite amène la caméra dessus et la fait suivre le satellite.
- Le bouton « i » d'un satellite ouvre sa fiche avec son rôle, sa date de lancement, son altitude, sa vitesse et la durée d'un tour.
- En vue d'ensemble, les satellites ne sont pas affichés et l'étiquette de la Terre reste lisible.
- À une date antérieure au lancement d'un satellite (Tiangong en 2020), il n'est pas affiché ; si la caméra le suivait, elle revient sur la Terre.
- À 1 month / s, les marqueurs des satellites en orbite basse disparaissent et leurs orbites restent affichées ; en pause, ils réapparaissent.
- L'événement « Hubble telescope launched » amène la caméra sur Hubble.
- En Real scale, les satellites sont à leur vraie distance de la Terre.

---

## Partie 2 — Missions autour de la Terre et vers la Lune

### 2.1 — Trajectoires de Sputnik 1 et Vostok 1, liées à leurs événements (6h)

#### Fichiers à créer

```
src/modules/solar-system/core/spacecraft/missions.ts            # catalogue des missions (nom, fenêtre, repère, faits)
src/modules/solar-system/core/spacecraft/historic-orbits.ts     # orbites de Sputnik 1 et Vostok 1
src/modules/solar-system/core/spacecraft/orbits/sidereal-time.ts       # temps sidéral de Greenwich
src/modules/solar-system/core/spacecraft/mission-events.ts      # événements liés aux missions
src/modules/solar-system/core/info/mission-facts.ts             # données de la fiche d'une mission
src/modules/solar-system/ui/spacecraft/missions/mission.node.ts               # ligne en pointillé + marqueur, visibles pendant la fenêtre
src/modules/solar-system/ui/info/spacecraft/mission-sections.ts            # sections de la fiche mission
```

#### Fichiers à modifier

```
src/modules/solar-system/core/spacecraft/spacecraft-ids.ts   # MissionId
src/modules/solar-system/core/sky-events.ts                  # SKY_EVENTS fusionne MISSION_EVENTS (tri par date) ; Sputnik 1 et First human in space visent leur mission
src/modules/solar-system/ui/solar-system.bodies.ts           # crée les nœuds missions, place les missions à chaque image
src/modules/solar-system/ui/info/info-content.ts             # fiche mission
src/styles.css                                               # couleur des missions (--flare-orange)
CHANGELOG.md, CHANGELOG.fr.md, RELEASES.md, RELEASES.fr.md
```

#### Détails

- Missions de cette sous-partie (repère `earth`) :

| Id | Nom | Fenêtre (UTC) | Orbite |
|---|---|---|---|
| `sputnik-1` | Sputnik 1 | 1957-10-04 19:28 → 1958-01-04 00:00 | périgée 215 km, apogée 939 km, inclinaison 65,1° |
| `vostok-1` | Vostok 1 | 1961-04-12 06:07 → 1961-04-12 07:55 | périgée 169 km, apogée 327 km, inclinaison 64,95° |

- Le nœud des deux orbites n'est pas publié : il est calculé pour que l'orbite passe au-dessus du pas de tir de Baïkonour (45,92° N, 63,34° E) à l'heure du lancement, grâce au temps sidéral de Greenwich (`sidereal-time.ts`, formule IAU 1982). Le périgée est placé au point de lancement.
- Trajectoire affichée :
  - Sputnik 1 : son orbite complète, propagée comme un satellite de la Partie 1.1 (Kepler + J2) ;
  - Vostok 1 : l'arc de son vol, du lancement à l'atterrissage (108 min, moins d'un tour). Le marqueur s'arrête au point d'atterrissage à 07:55 et disparaît avec la fin de la fenêtre.
- Nœud mission (`mission.node.ts`), commun à toutes les missions :
  - ligne en pointillé (`LineDashedMaterial`, couleur `--flare-orange`) sur toute la trajectoire de la fenêtre ;
  - marqueur à taille fixe à l'écran avec étiquette nom + « i » (réutilise `spacecraft-marker.ts`) ;
  - tout est visible seulement quand l'heure simulée est dans la fenêtre ; s'il est suivi quand il disparaît, la caméra revient sur l'astre central du repère (Terre ou Soleil).
- Les missions du repère `earth` sont attachées à `earth.holder` et utilisent `geocentric-scale.ts` ; elles suivent la même règle de visibilité de près que les satellites (Partie 1.1).
- Fiche mission : nom, ce qu'elle a fait (une phrase), date de lancement, destination, durée du voyage écoulée à la date simulée, et pendant la fenêtre altitude ou distance à la Terre et vitesse.
- Événements : `SkyEvent.focus` vise `sputnik-1` pour « Sputnik 1 » et `vostok-1` pour « First human in space ». Les nouveaux événements des parties suivantes vont dans `mission-events.ts` pour ne pas allonger `sky-events.ts` (déjà au-delà de la limite de lignes du lint).

#### Modèle de données

Aucune persistance. Types de domaine :

```ts
type MissionId = 'sputnik-1' | 'vostok-1' | 'apollo-11' | 'curiosity' | 'jwst'
  | 'voyager-1' | 'voyager-2' | 'cassini' | 'new-horizons';

type MissionFrame = 'earth' | 'sun';

type Mission = {
  id: MissionId;
  name: string;
  summary: string;               // une phrase pour la fiche
  destination: string;
  frame: MissionFrame;
  window: { start: number; end: number };   // ms UTC
};
```

La trajectoire n'est pas un champ de `Mission` : chaque source (orbite historique, Apollo, éphémérides) expose `positionAt(timestamp)` et `path()` pour son identifiant.

#### Statuts et transitions

Aucun champ de statut. La visibilité est dérivée de l'heure simulée et de la fenêtre, sans être stockée.

#### Erreurs exposées

Aucune.

#### Migration et rétrocompatibilité

Les cibles des événements « Sputnik 1 » et « First human in space » passent de `earth` à leur mission.

#### Architecture

- `core/spacecraft/` porte les catalogues et le calcul des positions, en km dans le repère écliptique J2000.
- `ui/spacecraft/missions/mission.node.ts` passe aux distances affichées et gère la visibilité.
- `SKY_EVENTS` reste la seule liste consommée par l'interface.

#### Sécurité

Aucun appel réseau, aucune donnée utilisateur.

#### Tests

Aucun outil de test dans le projet. Vérification manuelle :
- l'événement « Sputnik 1 » montre le marqueur au-dessus du Kazakhstan au moment du lancement ;
- Vostok 1 disparaît après 07:55 ;
- les deux sont absents en dehors de leur fenêtre.

Puis `pnpm type-check` et `pnpm lint`.

#### Observabilité

Aucune.

#### Performance

Négligeable : deux missions, positions analytiques.

#### Accessibilité

Mêmes étiquettes accessibles que les satellites. La ligne en pointillé et la couleur orange distinguent les missions des satellites ; le nom écrit reste la référence, la couleur n'est jamais la seule information.

#### Critères d'acceptation

- L'événement « Sputnik 1 » amène la caméra sur Sputnik 1, au-dessus de l'Asie centrale, avec son orbite en pointillé orange.
- L'événement « First human in space » montre Vostok 1 ; le temps défilant, le marqueur fait moins d'un tour puis disparaît à l'atterrissage, et la caméra revient sur la Terre.
- En dehors de leurs fenêtres (1960 pour Sputnik 1), ni ligne ni marqueur ne sont affichés.
- Le bouton « i » de Sputnik 1 ouvre sa fiche avec sa date de lancement et son altitude du moment.

### 2.2 — Trajectoire d'Apollo 11 vers la Lune et retour (4.5h)

#### Fichiers à créer

```
src/modules/solar-system/core/spacecraft/apollo-11/apollo-11.ts      # chronologie de la mission et phases
src/modules/solar-system/ui/spacecraft/missions/apollo-11.display.ts        # construction de la trajectoire en distances affichées
```

#### Fichiers à modifier

```
src/modules/solar-system/core/spacecraft/missions.ts        # mission apollo-11
src/modules/solar-system/core/spacecraft/mission-events.ts  # événement « Apollo 11 lifts off »
src/modules/solar-system/ui/spacecraft/missions/mission.node.ts           # accepte une trajectoire fournie par une source affichée
src/modules/solar-system/ui/solar-system.bodies.ts          # nœud Apollo 11 (a besoin du nœud Lune)
CHANGELOG.md, CHANGELOG.fr.md, RELEASES.md, RELEASES.fr.md
```

#### Détails

- Chronologie UTC (source : NASA Apollo 11 Flight Journal) :
  - décollage 1969-07-16 13:32 ;
  - injection vers la Lune 16:22 ;
  - mise en orbite lunaire 1969-07-19 17:21 ;
  - départ de la Lune 1969-07-22 04:55 ;
  - amerrissage 1969-07-24 16:50.
- Il n'existe pas d'éphéméride publique de la trajectoire. Elle est donc reconstruite schématiquement en 4 phases :
  1. orbite de parking circulaire à 190 km autour de la Terre ;
  2. trajet aller : courbe de Bézier cubique, du point d'injection jusqu'à l'entrée en orbite lunaire, à la position de la Lune le 19 juillet 17:21 ;
  3. orbite lunaire circulaire à 110 km, centrée sur la Lune affichée ;
  4. trajet retour : Bézier de la Lune le 22 juillet 04:55 jusqu'à la Terre.

  La fiche indique « Path drawn from the mission timeline ».
- La trajectoire est construite en distances affichées (`ui/spacecraft/missions/apollo-11.display.ts`), parce que l'orbite lunaire doit rester autour de la Lune agrandie en vue facile. Elle est reconstruite au changement d'échelle.
- Le marqueur avance selon la date simulée, linéairement dans le temps sur chaque phase.
- L'événement existant « First steps on the Moon » garde la Lune pour cible : à 20:17 le 20 juillet, le marqueur tourne en orbite lunaire, visible à côté de la Lune.
- Nouvel événement « Apollo 11 lifts off » (1969-07-16 13:32, cible `apollo-11`).

#### Modèle de données

Aucune persistance. `Apollo11Timeline` : cinq horodatages ms UTC nommés comme la chronologie ci-dessus.

#### Statuts et transitions

Aucun. La phase en cours est dérivée de l'heure simulée.

#### Erreurs exposées

Aucune.

#### Migration et rétrocompatibilité

Aucune.

#### Architecture

- Chronologie et altitudes dans `core/`.
- Assemblage de la courbe dans `ui/nodes/`, qui seul connaît les distances affichées.

#### Sécurité

Aucune.

#### Tests

Vérification manuelle :
- à 1969-07-19 17:21, le marqueur est au contact de l'orbite lunaire ;
- le 24 juillet après 16:50, ni ligne ni marqueur ;
- en Real scale, la trajectoire va bien jusqu'à la Lune lointaine.

Puis `pnpm type-check` et `pnpm lint`.

#### Observabilité

Aucune.

#### Performance

Trajectoire calculée une fois par changement d'échelle (environ 600 points).

#### Accessibilité

Identique à la sous-partie 2.1.

#### Critères d'acceptation

- L'événement « Apollo 11 lifts off » montre le vaisseau autour de la Terre puis, le temps défilant, partir vers la Lune sur une ligne en pointillé.
- L'événement « First steps on the Moon » montre le vaisseau en orbite autour de la Lune.
- La trajectoire relie la Terre et la Lune dans les deux échelles.
- Après l'amerrissage, la trajectoire et le marqueur disparaissent.

---

## Partie 3 — Sondes dans le système solaire

### 3.1 — Données des sondes (NASA/JPL Horizons), Curiosity et James Webb (6h)

#### Fichiers à créer

```
scripts/fetch-trajectories.ts                                  # télécharge les éphémérides Horizons et écrit les JSON
public/data/trajectories/curiosity.json
public/data/trajectories/jwst.json
src/modules/solar-system/infra/trajectory-catalog.ts           # charge et valide les fichiers de trajectoires
src/modules/solar-system/core/spacecraft/ephemeris.ts          # type Ephemeris, interpolation à une date
```

#### Fichiers à modifier

```
package.json                                                   # script "data:trajectories": "node scripts/fetch-trajectories.ts"
src/modules/solar-system/core/spacecraft/missions.ts           # missions curiosity et jwst
src/modules/solar-system/core/spacecraft/mission-events.ts     # événement « Curiosity lifts off »
src/modules/solar-system/core/sky-events.ts                    # « James Webb telescope launched » vise 'jwst'
src/solar-system.ts                                            # injecte loadTrajectories comme loadStars
src/modules/solar-system/ui/solar-system.view.ts               # appelle elements.loadTrajectories() avec les étoiles
src/modules/solar-system/ui/solar-system.bodies.ts             # nœuds des missions à éphémérides (repère sun dans la scène, earth sous earth.holder)
src/modules/solar-system/ui/spacecraft/missions/mission.node.ts              # source éphéméride
solar-system.html                                              # crédit « Trajectories from NASA/JPL Horizons »
README.md, README.fr.md                                        # script data:trajectories (README absents à ce jour : à créer si toujours absents)
CHANGELOG.md, CHANGELOG.fr.md, RELEASES.md, RELEASES.fr.md
```

#### Détails

- Le script, lancé à la main par un développeur (`pnpm data:trajectories`), interroge l'API publique `https://ssd.jpl.nasa.gov/api/horizons.api` :
  - paramètres : `EPHEM_TYPE=VECTORS`, `REF_PLANE=ECLIPTIC`, `REF_SYSTEM=ICRF`, `VEC_TABLE=1`, `CSV_FORMAT=YES` ;
  - Soleil comme centre (`500@10`, unités `AU-D`) pour les missions `sun` ; Terre comme centre (`500@399`, unités `KM-S`) pour `jwst` ;
  - il écrit les fichiers dans `public/data/trajectories/`, qui sont commités. Le site ne contacte jamais Horizons.
- Pas des échantillons : 1 jour dans les 30 jours qui entourent chaque rencontre déclarée, 10 jours ailleurs (2 jours pour les trajets de moins d'un an). Les dates Horizons (Julien TDB) sont converties en ms UTC en ignorant l'écart TDB/UTC (moins de 70 s).
- Format de fichier :
  ```json
  { "id": "curiosity", "center": "sun", "unit": "au", "samples": [t0, x0, y0, z0, t1, ...] }
  ```
  Coordonnées arrondies à 1e-6 de l'unité.
- Missions :

| Id | Code Horizons | Repère | Fenêtre UTC |
|---|---|---|---|
| `curiosity` | -76 | sun | 2011-11-26 15:02 → 2012-08-06 05:17 |
| `jwst` | -170 | earth | 2021-12-25 12:20 → 2030-01-01 00:00 |

  La fin de la fenêtre est plafonnée au 2030-01-01 pour les missions encore actives : les prévisions au-delà ne sont pas des données de mission.
- Position à une date : recherche dichotomique du bon intervalle, interpolation linéaire. Hors de la plage des échantillons, la mission est invisible.
- Chargement (`infra/trajectory-catalog.ts`) : tous les fichiers en parallèle, après les corps et en même temps que les étoiles. Un fichier est rejeté s'il manque, si son nombre de valeurs n'est pas un multiple de 4, si une valeur n'est pas un nombre fini ou si les dates ne sont pas croissantes. La page fonctionne sans la mission, avec un `console.warn`.
- Curiosity est attaché à la scène (repère Soleil), JWST à `earth.holder` avec `geocentric-scale.ts`. En vue facile, JWST au point L2 (1,5 million de km) apparaît un peu au-delà de la Lune.
- Événements :
  - nouveau « Curiosity lifts off » (2011-11-26 15:02, cible `curiosity`) ;
  - « James Webb telescope launched » vise `jwst` ;
  - « Curiosity lands on Mars » garde Mars pour cible : le marqueur y arrive à la fin de la fenêtre.

#### Modèle de données

Aucune persistance serveur. Fichier statique (voir Détails) et type de domaine :

```ts
type Ephemeris = {
  missionId: MissionId;
  center: 'sun' | 'earth';
  unit: 'au' | 'km';
  timestamps: Float64Array;   // ms UTC, croissants
  positions: Float64Array;    // x, y, z écliptiques J2000, même ordre
};
```

`infra/` transforme le tableau plat du fichier en ces deux tableaux typés. Les champs `center` et `unit` du fichier correspondent un pour un.

#### Statuts et transitions

Aucun.

#### Erreurs exposées

Aucune à l'utilisateur. Une trajectoire invalide ou absente fait simplement disparaître la mission.

#### Migration et rétrocompatibilité

La cible de « James Webb telescope launched » passe de `earth` à `jwst`. Si `jwst.json` est absent, la navigation vers une cible absente ne fait rien : l'événement change alors seulement la date.

#### Architecture

- `scripts/` est hors de `src/` et n'est pas embarqué dans le site.
- `infra/` importe seulement les types de `core/` (règle ESLint existante).
- Le chargeur est injecté depuis `src/solar-system.ts` dans les éléments de la page, comme `loadStars`, puisque `ui/` n'importe jamais `infra/`.

#### Sécurité

Horizons n'est interrogé que par le script de développement. Aucune clé n'est nécessaire. Les fichiers chargés par le site sont validés avant usage (voir Détails) ; aucun contenu n'est injecté dans le DOM.

#### Tests

Vérification manuelle :
- Curiosity part de la Terre le 26/11/2011 et touche Mars le 06/08/2012 ;
- JWST s'éloigne au-delà de la Lune en janvier 2022 ;
- en supprimant un fichier, la page se charge sans la mission, avec un avertissement en console.

Puis `pnpm type-check`, `pnpm lint` et `pnpm build`.

#### Observabilité

`console.warn('Trajectory unavailable', { missionId, reason })` quand un fichier est rejeté.

#### Performance

Moins de 30 Ko par fichier pour ces deux missions. Une recherche dichotomique par mission et par image.

#### Accessibilité

Identique à la sous-partie 2.1.

#### Critères d'acceptation

- L'événement « Curiosity lifts off » montre une trajectoire en pointillé de la Terre à Mars et le vaisseau qui la parcourt quand le temps défile.
- À la date de « Curiosity lands on Mars », le vaisseau est sur Mars, puis disparaît.
- L'événement « James Webb telescope launched » amène la caméra sur JWST, qui s'éloigne de la Terre au-delà de la Lune.
- Si un fichier de trajectoire manque ou est invalide, la page fonctionne et seule cette mission est absente.
- Le crédit NASA/JPL Horizons apparaît en bas de page.

### 3.2 — Voyager 1 et Voyager 2, avec leurs événements (3h)

#### Fichiers à créer

```
public/data/trajectories/voyager-1.json
public/data/trajectories/voyager-2.json
```

#### Fichiers à modifier

```
scripts/fetch-trajectories.ts                                  # missions et rencontres Voyager
src/modules/solar-system/core/spacecraft/missions.ts           # voyager-1, voyager-2
src/modules/solar-system/core/spacecraft/mission-events.ts     # 7 événements
CHANGELOG.md, CHANGELOG.fr.md, RELEASES.md, RELEASES.fr.md
```

#### Détails

- Missions (repère `sun`) :
  - `voyager-1` (Horizons -31) : 1977-09-05 12:56 → 2030-01-01 ;
  - `voyager-2` (Horizons -32) : 1977-08-20 14:29 → 2030-01-01.
- Rencontres (échantillonnées à 1 jour par le script) :
  - Voyager 1 : Jupiter 1979-03-05, Saturne 1980-11-12 ;
  - Voyager 2 : Jupiter 1979-07-09, Saturne 1981-08-26, Uranus 1986-01-24, Neptune 1989-08-25.
- Événements (UTC, source : NASA/JPL Voyager mission pages) :

| Titre | Date | Précision | Cible |
|---|---|---|---|
| Voyager 2 lifts off | 1977-08-20 14:29 | minute | `voyager-2` |
| Voyager 1 lifts off | 1977-09-05 12:56 | minute | `voyager-1` |
| Voyager 1 flies past Jupiter | 1979-03-05 12:05 | minute | `voyager-1` |
| Voyager 1 flies past Saturn | 1980-11-12 23:46 | minute | `voyager-1` |
| Voyager 2 flies past Uranus | 1986-01-24 17:59 | minute | `voyager-2` |
| Voyager 2 flies past Neptune | 1989-08-25 03:56 | minute | `voyager-2` |
| Voyager 1 leaves the Sun's bubble | 2012-08-25 | jour | `voyager-1` |

- Voyager 1 dépasse 160 UA en 2030, soit plus de 1 100 unités de scène. Le plan lointain de la caméra (5 000) le couvre ; la vue d'ensemble (900 au plus) ne montre plus que le début de sa trajectoire, ce qui est voulu : c'est en le suivant qu'on mesure la distance.

#### Modèle de données

Aucun nouveau type ; fichiers au format de la sous-partie 3.1.

#### Statuts et transitions

Aucun.

#### Erreurs exposées

Aucune.

#### Migration et rétrocompatibilité

Aucune.

#### Architecture

Aucune nouvelle couche. Ajout de données dans les catalogues de la sous-partie 3.1.

#### Sécurité

Identique à la sous-partie 3.1.

#### Tests

Vérification manuelle : à chaque événement de survol, le vaisseau est à côté de la planète nommée. Puis `pnpm type-check` et `pnpm lint`.

#### Observabilité

Identique à la sous-partie 3.1.

#### Performance

Environ 2 000 échantillons par sonde, moins de 80 Ko par fichier.

#### Accessibilité

Identique à la sous-partie 2.1.

#### Critères d'acceptation

- Les 7 événements apparaissent dans la liste Events, à leur place chronologique.
- À chaque événement de survol, la caméra suit la sonde, qui passe à côté de la planète nommée.
- Les deux trajectoires sont visibles en pointillé de leur lancement jusqu'en 2030, et absentes avant le lancement.

### 3.3 — Cassini et New Horizons, avec leurs événements (2.5h)

#### Fichiers à créer

```
public/data/trajectories/cassini.json
public/data/trajectories/new-horizons.json
```

#### Fichiers à modifier

```
scripts/fetch-trajectories.ts                                  # missions et rencontres
src/modules/solar-system/core/spacecraft/missions.ts           # cassini, new-horizons
src/modules/solar-system/core/spacecraft/mission-events.ts     # 4 événements
CHANGELOG.md, CHANGELOG.fr.md, RELEASES.md, RELEASES.fr.md
```

#### Détails

- Missions (repère `sun`) :
  - `cassini` (Horizons -82) : 1997-10-15 08:43 → 2017-09-15 10:31 (plongée dans Saturne). Rencontres : Vénus 1998-04-26 et 1999-06-24, Terre 1999-08-18, Jupiter 2000-12-30, arrivée à Saturne 2004-07-01. À Saturne, échantillons à 1 jour : les orbites autour de Saturne se voient en suivant la sonde.
  - `new-horizons` (Horizons -98) : 2006-01-19 19:00 → 2030-01-01. Rencontres : Jupiter 2007-02-28, Pluton 2015-07-14, Arrokoth 2019-01-01.
- Événements (UTC, source : NASA mission pages) :

| Titre | Date | Précision | Cible |
|---|---|---|---|
| Cassini lifts off | 1997-10-15 08:43 | minute | `cassini` |
| Cassini arrives at Saturn | 2004-07-01 02:48 | minute | `cassini` |
| Cassini dives into Saturn | 2017-09-15 10:31 | minute | `cassini` |
| New Horizons flies past Pluto | 2015-07-14 11:49 | minute | `new-horizons` |

- Pluton n'est pas un astre de la page. La fiche de New Horizons indique sa distance au Soleil, ce qui situe le survol.

#### Modèle de données

Aucun nouveau type.

#### Statuts et transitions

Aucun.

#### Erreurs exposées

Aucune.

#### Migration et rétrocompatibilité

Aucune.

#### Architecture

Identique à la sous-partie 3.2.

#### Sécurité

Identique à la sous-partie 3.1.

#### Tests

Vérification manuelle :
- Cassini tourne autour de Saturne entre 2004 et 2017 ;
- Cassini disparaît après le 15/09/2017 10:31 ;
- New Horizons est à environ 33 UA du Soleil le 14/07/2015.

Puis `pnpm type-check` et `pnpm lint`.

#### Observabilité

Identique à la sous-partie 3.1.

#### Performance

Cassini a environ 5 500 échantillons (13 ans à 1 jour autour de Saturne), environ 200 Ko. Les fichiers sont servis compressés par nginx.

#### Accessibilité

Identique à la sous-partie 2.1.

#### Critères d'acceptation

- Les 4 événements apparaissent dans la liste Events.
- « Cassini arrives at Saturn » montre la sonde près de Saturne ; en suivant Cassini et en laissant défiler le temps, elle tourne autour de Saturne.
- Après « Cassini dives into Saturn », la trajectoire et le marqueur disparaissent.
- « New Horizons flies past Pluto » montre la sonde au-delà de Neptune.

---

## Flow complet

1. L'enfant ouvre la page Solar system : les planètes tournent, et les sondes en vol à la date du jour (Voyager 1 et 2, New Horizons, JWST) sont visibles avec leur trajectoire en pointillé orange.
2. Il zoome sur la Terre ou clique sur Earth : les satellites apparaissent autour d'elle avec leur nom. Il clique sur ISS : la caméra suit la station ; le bouton « i » donne son altitude, sa vitesse et le temps d'un tour.
3. Il ouvre Events et choisit « Sputnik 1 » : la date passe au 4 octobre 1957, les satellites modernes disparaissent, la caméra suit Sputnik 1 sur son orbite.
4. Il choisit « Apollo 11 lifts off », appuie sur Play à 1 hour / s : le vaisseau quitte l'orbite terrestre et rejoint la Lune.
5. Il choisit « Voyager 2 flies past Neptune » : la caméra suit la sonde au moment où elle passe à côté de Neptune. À 1 year / s, il la voit s'éloigner du système solaire.
6. Real scale montre les mêmes engins à leurs vraies distances ; Easy view revient à l'affichage lisible.

## Résumé des temps

| Sous-partie | Titre | Temps |
|---|---|---|
| 1.1 | Satellites autour de la Terre, cliquables, avec leur fiche | 7.5h |
| 2.1 | Trajectoires de Sputnik 1 et Vostok 1 | 6h |
| 2.2 | Trajectoire d'Apollo 11 | 4.5h |
| 3.1 | Données Horizons, Curiosity et James Webb | 6h |
| 3.2 | Voyager 1 et Voyager 2 | 3h |
| 3.3 | Cassini et New Horizons | 2.5h |
| **Total** | | **29.5h** |

## Dépendances techniques

- `three` 0.187 (déjà présent) : `LineDashedMaterial`, `PointsMaterial`, `CSS2DObject`.
- Node 24 (déjà utilisé) pour exécuter `scripts/fetch-trajectories.ts` sans outil supplémentaire (exécution native du TypeScript).
- Données externes, copiées une fois dans le dépôt :
  - éléments GP CelesTrak (satellites) ;
  - API NASA/JPL Horizons (sondes), créditée sur la page.

## Ordre d'implémentation recommandé

1. 1.1 : introduit `FocusId`, l'union `FocusTarget`, `geocentric-scale.ts`, le marqueur d'engin et la propagation d'orbite terrestre, utilisés par toutes les suites.
2. 2.1 : introduit `Mission`, `mission.node.ts`, la fiche mission et `mission-events.ts`.
3. 2.2 : utilise `mission.node.ts` et le nœud Lune.
4. 3.1 : introduit les éphémérides, le script et le chargement.
5. 3.2 puis 3.3 : n'ajoutent que des données et des événements sur l'infrastructure de 3.1.
