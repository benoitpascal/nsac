# Plan : scénario de l'acte Lune (tableau de bord, académie, préparation, missions, débrief, journées)

## Contexte

Aujourd'hui, les pages de l'acte Lune s'enchaînent en dur : cinématique, Day One, briefing figé, puis la marche 3D. Il n'y a ni histoire, ni mission, ni conséquence. Ce plan installe la boucle de jeu d'une journée : la mascotte accueille le joueur et lui explique la mission, l'académie apprend la vraie technologie (données NASA réelles), le joueur prépare son équipement en quantité limitée, joue la mission (pilotage de l'excavateur en 3D ou mini-jeu), puis la mascotte débriefe ce qu'il a consommé en air, électricité et eau. La journée se termine sur un écran de transition (« Day two »…). C'est la réponse directe aux règles de l'énoncé : arbitrages réels, effets différés, échec instructif, lien jeu ↔ réel.

## Ce qui existe déjà

- `briefing.html` + `src/briefing.css` + `src/hud.css` : tableau de bord statique (image de la base, objectifs, 4 jauges figées, boutons Back et Launch mission).
- `day-one.html` + `src/day-one.css` + `src/status-card.css` : titre « DAY ONE » animé, trois cartes de statut, bouton Continue vers le briefing.
- `src/modules/moon-intro/` : cinématique d'alunissage, qui ouvre `/day-one.html` à la fin (`src/moon-intro.ts`).
- `src/modules/planet-walk/` : marche 3D sur la Lune, terminal de la base qui ouvre un tableau de bord dans la scène (`ui/dashboard/station-dashboard.ts`), pilotage de l'excavateur (`ui/controls/excavator-driving.ts`, `core/excavator/excavator-power.ts` : batterie, chargement, régolithe livré ; `core/excavator/magnetic-storm.ts` : tempête qui brouille les touches).
- `src/modules/minigames/` : 16 mini-jeux au contrat commun `MiniGame` (`start(container, finish)`, résultat `{ won, score 0–100 }`), dont `laser-mirrors` (score selon le nombre de bascules de miroirs).
- `public/game-design/mascotte.png` (mascotte astronaute, 1366 × 768) et `public/game-design/Bulle futuriste bleue au néon.png` (cadre de bulle néon).
- Jetons de design et composants partagés : `src/styles.css` (pill button, logotype), `src/hud.css` (panneaux à coins coupés), sprite `public/arcadia/hud-icons.svg`.
- Aucun lanceur de tests dans le projet, aucun mécanisme de seeds.

## Ce qui manque

- Un état de partie (journée, mission, étape, ressources de la base, résultats) qui survive au rechargement.
- Un contenu de scénario déclaratif (journées, missions, textes de la mascotte, fiches d'académie, équipement).
- Les écrans mascotte (accueil, académie, préparation, débrief, fin d'acte) et le routage du bouton Launch mission selon l'étape.
- Un mode « mission » pour la 3D (excavateur) et une page qui héberge un mini-jeu de mission (laser).
- Une page de transition de journée générique (« Day one », « Day two »…).

## Concepts clés

- **Acte** : l'acte Lune (Act 2). Il contient des **journées**, chacune contenant des **missions** jouées dans l'ordre.
- **Mission** : un objectif, un texte d'accueil de la mascotte, une **académie** (pages explicatives), une **préparation** facultative, un **jeu** (`excavator` en 3D ou un mini-jeu par son id) et une règle de **notation**.
- **Étape** (`stage`) : où en est le joueur dans la mission courante. Le tableau de bord (`briefing.html`) est le routeur : il affiche l'écran de l'étape.
- **Ressources de la base** : trois jauges en pourcentage, **air**, **électricité** (`power`), **eau**. Ce sont les seules ressources centrales (règle 3 de l'énoncé). Le régolithe est un objectif de mission, pas une jauge.
- **Équipement** (`loadout`) : ce que le joueur emporte, limité par un sac à 4 emplacements et par le stock de la base.
- **Verdict** : `efficient` (objectif atteint sans gaspiller), `wasteful` (objectif atteint mais trop consommé), `unfinished` (objectif manqué).
- **Dialogue** : suite de pages de la mascotte. Une page est un **texte** (bouton Next), un **choix** (1 à 4 options, chacune avec sa réponse de la mascotte et la page où elle mène, sans bonne ou mauvaise option) ou une **question** (2 à 4 réponses, une seule juste, chacune avec son explication). Une mauvaise réponse n'est jamais punie : la mascotte explique pourquoi, la réponse est grisée et le joueur réessaie. Les dialogues n'ont aucun effet sur les jauges : ils racontent et vérifient la compréhension, les arbitrages se font en préparation et en mission.
- La mascotte n'a pas de nom : dans le code elle s'appelle `guide`, dans l'interface elle parle à la première personne (« I'm your station assistant »).
- Langue de l'interface : anglais, comme le reste du site. Chaque texte passe par le skill `junior-mission-review` ; chaque valeur de jeu simplifiée ou inventée est notée dans `DATA.md`.

## Dépendances inter-features

- Consomme `src/modules/planet-walk/` (pilotage de l'excavateur) : la Partie 4.1 le paramètre, elle ne le réécrit pas.
- Consomme `src/modules/minigames/` (contrat `MiniGame` et `laserMirrorsGame`) : la Partie 5.1 l'héberge tel quel.
- Aucune autre feature en cours ne modifie ces modules.

---

## Partie 1 — Partie sauvegardée et tableau de bord piloté par le scénario

### 1.1 — Le tableau de bord devient un template : mascotte, dialogue avec choix et questions, vraies jauges, sauvegarde (10.5h)

#### Fichiers à créer

```
vitest.config.ts                                    # environnement jsdom, alias @ identique à vite.config.ts
tests/helpers/campaigns.ts                          # Object Mothers : partie neuve, partie en débrief, partie en fin de jour
tests/scenario/campaign.test.ts                     # parcours de la machine à étapes
tests/scenario/base-stores.test.ts                  # application des consommations, bornes 0–100
tests/scenario/campaign-storage.test.ts             # lecture / écriture / sauvegarde corrompue
tests/scenario/dialogue.test.ts                     # navigation : Next, choix, question juste / fausse, renvois
tests/scenario/content.test.ts                      # validation du contenu de l'acte (nombre d'options, une seule réponse juste, renvois existants)
src/modules/scenario/core/dialogue.ts               # navigation dans un dialogue (fonctions pures)
src/briefing.ts                                     # point d'entrée de briefing.html
src/modules/scenario/core/scenario-content.ts       # types du contenu (Act, Day, Mission, GuidePage, Source)
src/modules/scenario/core/act-moon.ts               # contenu de l'acte Lune (jour 1, textes d'accueil)
src/modules/scenario/core/campaign.ts               # état de partie, étapes, transitions (fonctions pures)
src/modules/scenario/core/base-stores.ts            # jauges air / power / water, consommation bornée
src/modules/scenario/infra/campaign-storage.ts      # localStorage : load, save, reset, validation
src/modules/scenario/ui/guide-dialogue.view.ts      # mascotte à gauche, bulle à droite : texte (Next / Back), choix et questions (1 à 4 boutons)
src/modules/scenario/ui/dashboard.view.ts           # objectif du jour, jauges, Launch mission, Back, New game
src/modules/scenario/ui/briefing-router.view.ts     # choisit l'écran selon l'étape
src/guide.css                                       # mise en page mascotte + bulle (réutilisée par toutes les étapes)
public/arcadia/guide.png                            # mascotte détourée, recadrée (depuis public/game-design/mascotte.png)
public/arcadia/guide-bubble.png                     # cadre de bulle (depuis « Bulle futuriste bleue au néon.png »)
```

#### Fichiers à modifier

```
package.json                    # devDependencies vitest ^4.1 et jsdom ^27 ; scripts "test": "vitest run", "test:watch": "vitest"
tsconfig.json                   # inclure tests/ et les types vitest/globals
eslint.config.mjs               # lint de tests/ (mêmes règles, max-lines désactivé pour les fichiers de test)
briefing.html                   # devient un template : conteneurs vides #guide, #dashboard, script src/briefing.ts ; image de la station retirée
src/briefing.css                # colonne mascotte à gauche, panneau texte à droite, 3 jauges au lieu de 4
CLAUDE.md                       # architecture : module scenario, briefing routeur, commande pnpm test
README.md / README.fr.md        # script pnpm test, dossier tests/
DATA.md                         # valeurs de départ des jauges (air 100 %, power 85 %, water 60 %) : choix de jeu
CHANGELOG.md / CHANGELOG.fr.md  # Functional + Technical
RELEASES.md / RELEASES.fr.md    # la mascotte accueille le joueur, la partie est gardée
```

#### Détails

- Contenu déclaratif (`act-moon.ts`) : un acte = `{ id: 'moon', days: Day[] }`, un jour = `{ number, title, missions: Mission[] }`, une mission = `{ id, title, goal, briefing: GuidePage[], academy: GuidePage[], preparation?: PreparationSpec, game: GameRef, scoring: ScoringId }`. En 1.1, le jour 1 ne contient que l'accueil et la mission `excavator` avec son texte d'accueil ; académie, préparation et jeu sont ajoutés par les Parties 2, 3 et 4.
- Une `GuidePage` est un texte, un choix ou une question (types dans Modèle de données), 60 mots au plus par page pour rester lisible par un enfant de 7–12 ans.
- Dialogue (`core/dialogue.ts`, pur) :
  - **Texte** : Next passe à la page suivante, Back revient à la page précédemment affichée (historique de lecture, pas l'ordre du contenu, pour que Back après un choix revienne au choix).
  - **Choix** : 1 à 4 options. Choisir affiche la réponse de la mascotte à cette option (`reply`, une ou plusieurs pages de texte), puis va à la page `goto` de l'option, ou à la page suivante si `goto` est absent. Un choix à une seule option sert de relance (« Got it! », « Tell me more »). Une option peut renvoyer en arrière (« Can you explain again? ») : les boucles sont permises.
  - **Question** : 2 à 4 réponses, exactement une juste. Une mauvaise réponse affiche son explication et se grise, le joueur choisit à nouveau ; la bonne réponse affiche son explication puis Next. Aucun score, aucune pénalité.
  - Fin du dialogue : après la dernière page, la vue appelle l'action de fin de l'écran (afficher le tableau de bord en 1.1, `finishAcademy` en 2.1, etc.).
  - La position dans un dialogue n'est pas sauvegardée : après un rechargement, le dialogue de l'étape reprend à sa première page (dialogues courts, et l'étape, elle, est sauvegardée).
- Contenu validé par un test (`content.test.ts`) : nombre d'options et de réponses dans les bornes, une seule réponse juste par question, chaque `goto` désigne un `id` de page existant dans le même dialogue, ids uniques.
- Texte d'accueil du jour 1 (pages, à écrire puis relire avec `junior-mission-review`) : bienvenue sur la station, qui est la mascotte, où on est (base près du pôle Sud de la Lune), ce qui compte pour survivre (air, électricité, eau), ce qu'on va faire aujourd'hui (collecter du régolithe avec le robot, puis envoyer les données du jour vers la Terre), comment lire le tableau de bord. Il contient au moins un choix (« Who are you? » / « Where are we? » / « Let's get to work! », chacun avec sa réponse) et une question (« What do we need most to stay alive here? », réponses air / sand / music, l'air étant juste).
- État de partie (`campaign.ts`) et transitions, toutes pures : `newCampaign()`, `launch(state, act)`, `finishAcademy`, `confirmLoadout`, `recordResult`, `retryMission`, `continueAfterDebrief`, `startNextDay`. Une transition demandée depuis une étape qui ne l'autorise pas renvoie l'état inchangé (pas d'exception : le joueur a pu ouvrir une page dans un autre onglet).
- Routeur (`briefing-router.view.ts`) : `briefing` affiche le dialogue d'accueil puis le tableau de bord ; les autres étapes affichent leur écran (ajoutés par les parties suivantes). Tant qu'une étape n'a pas d'écran, le tableau de bord s'affiche.
- Tableau de bord : jour et lieu, objectif de la mission courante, les trois jauges lues dans l'état, bouton **Launch mission** (`launch`), bouton **Back** vers `/planet-walk.html` (explorer la base, sans mission), bouton **New game** (remise à zéro après une confirmation en ligne : le bouton devient « Sure? Start over », sans boîte de dialogue navigateur).
- Si aucune sauvegarde n'existe en arrivant sur `briefing.html`, une partie neuve est créée (jour 1, mission 1, étape `briefing`).
- Sauvegarde synchrone après chaque transition. Plusieurs onglets : le dernier qui écrit gagne ; `briefing.html` écoute l'événement `storage` et se réaffiche avec l'état relu, pour qu'un onglet ne montre pas un état périmé.

#### Modèle de données

Contenu (non persisté) :

```ts
type Source = { label: string; url: string };
type TextPage = { kind: 'text'; id?: string; text: string; highlight?: string; source?: Source };
type ChoiceOption = { label: string; reply: TextPage[]; goto?: string };
type ChoicePage = { kind: 'choice'; id?: string; text: string; options: ChoiceOption[] };     // 1 à 4 options
type Answer = { label: string; correct: boolean; explanation: string };
type QuestionPage = { kind: 'question'; id?: string; text: string; answers: Answer[] };     // 2 à 4 réponses, une seule juste
type GuidePage = TextPage | ChoicePage | QuestionPage;
```

État de partie (persisté) :

```ts
type Stage = 'briefing' | 'academy' | 'preparation' | 'ready' | 'debrief' | 'dayEnd' | 'actEnd';

type BaseStores = { air: number; power: number; water: number }; // pourcentages 0–100

type Loadout = { tool: ToolId; oxygenBottles: number; spareBatteries: number }; // Partie 3.1

type MissionResult = {
  missionId: string;
  verdict: 'efficient' | 'wasteful' | 'unfinished';
  objectiveShare: number;          // 0–1
  used: BaseStores;                // points de pourcentage consommés (positifs) ou gagnés (négatifs)
  details: Record<string, number>; // mesures propres à la mission (kg livrés, bascules, secondes dehors)
};

type CampaignState = {
  version: 1;
  actId: 'moon';
  dayIndex: number;      // 0 = jour 1
  missionIndex: number;  // dans le jour courant
  stage: Stage;
  stores: BaseStores;
  loadout: Loadout | null;
  lastResult: MissionResult | null;
  history: MissionResult[];
};
```

Persistance : `localStorage['arcadia.campaign']` = `JSON.stringify(CampaignState)`, champs identiques à l'entité. `loadout` et `lastResult` sont présents dès 1.1 (à `null`) pour que le format ne change pas ensuite.

#### Statuts et transitions

```
briefing    --launch-->               academy
academy     --finishAcademy-->        preparation   (si la mission a une préparation)
academy     --finishAcademy-->        ready         (sinon)
preparation --confirmLoadout-->       ready
preparation --skipMission-->          debrief       (aucun équipement abordable, voir 3.1)
ready       --launch-->               ready         (ouvre le jeu ; l'étape ne change qu'au résultat)
ready       --recordResult-->         debrief
debrief     --retryMission-->         preparation | ready
debrief     --continueAfterDebrief--> briefing      (mission suivante du même jour)
debrief     --continueAfterDebrief--> dayEnd        (dernière mission du jour)
dayEnd      --startNextDay-->         briefing      (jour suivant qui a des missions)
dayEnd      --startNextDay-->         actEnd        (plus de jour jouable)
actEnd      --newCampaign-->          briefing      (terminal sinon)
```

En 1.1, seules `briefing` et `newCampaign` sont branchées à l'interface ; les autres transitions sont codées et testées ici, et chaque partie suivante branche son écran.

#### Erreurs exposées

- Sauvegarde illisible (JSON invalide, `version` inconnue, champ manquant ou hors bornes) : la partie repart de zéro, la mascotte affiche « I couldn't find your last mission, so we're starting a new one. »
- `localStorage` indisponible (navigation privée stricte, quota) : la partie se joue en mémoire, un bandeau discret dit « Your progress won't be saved on this browser. »

#### Migration et rétrocompatibilité

Pas de donnée existante. Le champ `version: 1` permet une migration future ; toute autre version est traitée comme une sauvegarde illisible.

#### Architecture

- `core/` : contenu, état, transitions, jauges. Aucun accès DOM ni `localStorage`.
- `infra/campaign-storage.ts` : seul module qui touche `localStorage` ; importe uniquement des types de `core/`.
- `ui/` : vues humbles (DOM + événements), qui appellent les transitions puis `save`.
- `src/briefing.ts` câble `infra` et `ui` (le point d'entrée est le seul endroit qui connaît les deux).
- `src/guide.css` est la mise en page mascotte commune aux écrans des étapes : un seul composant, pas de copie par écran.

#### Sécurité

Aucune donnée personnelle, aucun appel réseau. Le contenu de `localStorage` est validé champ par champ avant usage (bornes des index, étapes connues, jauges 0–100) ; tous les textes passent par `textContent`, jamais `innerHTML`.

#### Tests

Mise en place de Vitest (environnement `jsdom` pour l'infra). Tests de parcours (journey) sur `core/campaign.ts` : partie neuve → `launch` → `finishAcademy` → `confirmLoadout` → `recordResult` → `continueAfterDebrief` → `startNextDay` ; chemins alternatifs : transition interdite renvoie l'état inchangé, `retryMission` revient en `preparation` ou `ready` selon la mission, fin d'acte. `base-stores` : consommation bornée à 0, gain borné à 100. `dialogue` : Next et Back sur des textes ; choix à 1 et à 4 options, réponse puis `goto`, réponse puis page suivante sans `goto`, boucle en arrière ; question : mauvaise réponse grisée puis bonne réponse, Back après un choix revient au choix ; fin de dialogue signalée. `content` : l'acte Lune respecte les bornes (1–4 options, 2–4 réponses, une seule juste, renvois existants). `campaign-storage` : aller-retour, JSON invalide, version inconnue, index hors bornes, `localStorage` qui lève.

#### Observabilité

`console.warn('[scenario] save reset', { reason })` quand une sauvegarde est rejetée ; `console.warn('[scenario] storage unavailable')`. Pas d'autre journal (site statique sans backend).

#### Performance

Aucun. Une lecture et une écriture `localStorage` de moins de 2 Ko par transition.

#### Accessibilité

Mascotte `alt=""` (décorative) ; bulle `aria-live="polite"` pour que le texte de chaque page soit lu ; boutons Next / Back / Launch accessibles au clavier, focus déplacé sur le texte à chaque page ; options et réponses en vrais `<button>` dans un groupe libellé par la question, raccourcis clavier 1 à 4 ; réponse fausse grisée avec `aria-disabled` et son explication annoncée, juste / faux signalé par un texte et une icône, pas seulement une couleur ; jauges `role="meter"` avec `aria-valuenow` ; cibles tactiles 44 px minimum ; la mise en page passe en colonne sous 900 px (mascotte au-dessus, réduite) ; animations désactivées avec `prefers-reduced-motion`.

#### Critères d'acceptation

- En ouvrant `briefing.html` sans sauvegarde, la mascotte s'affiche à gauche et présente le texte d'accueil du jour 1 page par page (Next / Back), puis le tableau de bord montre l'objectif de la mission et trois jauges air 100 %, power 85 %, water 60 %.
- Sur une page de choix, chaque option (1 à 4) donne une réponse différente de la mascotte puis mène à la suite prévue par le contenu.
- Sur une question, une mauvaise réponse affiche son explication et se grise, sans rien coûter ; la bonne réponse affiche son explication et permet de continuer.
- Tout se fait au clavier, y compris les choix avec les touches 1 à 4.
- Après un rechargement, le joueur retrouve la même étape et les mêmes jauges.
- New game, confirmé, remet le jour 1 et les jauges de départ.
- Avec une sauvegarde corrompue, la partie repart de zéro et la mascotte le dit.
- Back ouvre l'exploration 3D.
- `pnpm test` passe.

### 1.2 — Dans la 3D, le terminal ramène au tableau de bord (2.5h)

#### Fichiers à créer

Aucun

#### Fichiers à modifier

```
src/modules/planet-walk/core/station/station-actions.ts   # l'action du terminal devient { kind: 'openBriefing' } ; activité 'dashboard' retirée
src/modules/planet-walk/ui/controls/station-actions.ts    # openBriefing navigue vers /briefing.html
src/modules/planet-walk/ui/planet-walk.view.ts            # ne monte plus le tableau de bord dans la scène
src/planet-walk.ts                                        # retire l'élément dashboard des options
planet-walk.html                                          # retire #station-dashboard ; le lien Back mène à /briefing.html ; aide mise à jour
src/pages.css                                             # retire les styles .station-dashboard
CHANGELOG.md / CHANGELOG.fr.md, RELEASES.md / RELEASES.fr.md
```

Supprimés : `src/modules/planet-walk/ui/dashboard/station-dashboard.ts`, `src/modules/planet-walk/ui/dashboard/dashboard-rows.ts`, et le bouton « Drive the excavator » (le pilotage passe par Launch mission, voir 4.1). Les lectures en direct (`core/station/readings.ts`, `conditions.ts`) restent : elles servent toujours au ciel et à la lumière ; ce qui n'est plus utilisé par personne est retiré avec ses imports.

#### Détails

Une seule source de vérité pour l'état de la base : le tableau de bord du scénario. E au terminal quitte la 3D et ouvre `briefing.html`. Les portes du sas gardent leur comportement.

#### Modèle de données

Aucun

#### Statuts et transitions

`Activity` passe de `'walking' | 'dashboard' | 'driving'` à `'walking' | 'driving'`.

#### Erreurs exposées

Aucun

#### Migration et rétrocompatibilité

Le pilotage libre de l'excavateur hors mission disparaît : il ne se lance plus que par Launch mission (4.1). Jusqu'à la livraison de 4.1, l'excavateur reste visible mais non pilotable.

#### Architecture

`core/station/station-actions.ts` reste pur ; la navigation est faite dans `ui/controls/station-actions.ts`.

#### Sécurité

Aucun

#### Tests

`tests/planet-walk/station-actions.test.ts` : au terminal l'action proposée est `openBriefing` ; devant une porte, `passDoor` ; ailleurs, rien.

#### Observabilité

Aucun

#### Performance

Aucun

#### Accessibilité

Le libellé de l'invite d'action devient « E · Open the station dashboard » ; l'aide de la page est mise à jour.

#### Critères d'acceptation

- Dans la 3D, E au terminal ouvre le tableau de bord du scénario.
- Le lien Back de la 3D ramène au tableau de bord.
- Les portes du sas fonctionnent comme avant.

---

## Partie 2 — Académie

### 2.1 — Launch mission ouvre l'académie de la mission, expliquée par la mascotte (4h)

#### Fichiers à créer

```
src/modules/scenario/ui/academy.view.ts    # pages d'académie (dialogue mascotte) + encart « Real data » avec source
tests/scenario/academy-flow.test.ts        # launch puis finishAcademy selon la présence d'une préparation
```

#### Fichiers à modifier

```
src/modules/scenario/core/act-moon.ts               # académie de la mission excavator
src/modules/scenario/ui/briefing-router.view.ts     # étape academy → academy.view
src/modules/scenario/ui/guide-dialogue.view.ts      # encart source (lien externe, rel="noopener")
src/guide.css                                       # encart « Real data »
DATA.md                                             # faits cités et leurs sources
CHANGELOG.md / CHANGELOG.fr.md, RELEASES.md / RELEASES.fr.md
```

#### Détails

- Launch mission à l'étape `briefing` passe en `academy` et affiche les pages d'académie dans le même gabarit mascotte.
- Académie de l'excavateur (faits à citer avec leur source, vérifiés avec `junior-mission-review` avant commit) : le régolithe, la poussière et les cailloux qui couvrent la Lune ; le robot RASSOR de la NASA (Kennedy Space Center, Swamp Works), dont les deux tambours tournent en sens opposés pour creuser sans que le robot léger ne glisse, utile car la gravité lunaire vaut un sixième de celle de la Terre (1,62 m/s²) ; la mission LCROSS (2009) a trouvé de la glace d'eau dans le cratère Cabeus près du pôle Sud ; avec l'eau on boit, et en la cassant par électrolyse on obtient de l'oxygène à respirer ; comment piloter (touches, creuser dans la zone grise, vider dans la zone orange) ; ce qui consomme (rouler et faire tourner les tambours vident la batterie).
- La dernière page propose « I'm ready » : `finishAcademy`, puis l'écran de préparation (Partie 3) ou, s'il n'existe pas encore, le tableau de bord en étape `ready`.
- Une académie déjà terminée n'est pas reproposée pour cette mission (sauf New game) ; un bouton « Review the academy » sur le tableau de bord la rouvre en lecture seule, sans changer d'étape.

#### Modèle de données

Aucun nouveau champ : l'étape `academy` existe depuis 1.1.

#### Statuts et transitions

Branchées : `briefing → academy`, `academy → preparation | ready`.

#### Erreurs exposées

Aucun

#### Migration et rétrocompatibilité

Une sauvegarde déjà en `briefing` passe naturellement par l'académie au prochain Launch.

#### Architecture

Le contenu vit dans `core/act-moon.ts`, la vue ne contient aucun texte de jeu.

#### Sécurité

Liens de source vers des domaines NASA uniquement, `target="_blank" rel="noopener noreferrer"`.

#### Tests

Parcours : `launch` depuis `briefing` mène à `academy` ; `finishAcademy` mène à `preparation` pour une mission avec préparation, à `ready` sinon ; « Review the academy » ne change pas l'étape.

#### Observabilité

Aucun

#### Performance

Aucun

#### Accessibilité

Même dialogue que 1.1 ; le lien de source annonce l'ouverture d'un nouvel onglet (`aria-label`).

#### Critères d'acceptation

- Au premier Launch mission, la mascotte explique la mission page par page avec au moins un fait réel et sa source cliquable.
- « I'm ready » mène à la préparation (ou au tableau de bord prêt à lancer si la mission n'a pas de préparation).
- Après un rechargement au milieu de l'académie, on revient dans l'académie.

---

## Partie 3 — Préparation

### 3.1 — Le joueur choisit son outil, ses bouteilles d'oxygène et ses batteries de secours, en quantité limitée (5h)

#### Fichiers à créer

```
src/modules/scenario/core/loadout.ts               # objets, emplacements, stock, validation, coût prévisionnel
src/modules/scenario/ui/preparation.view.ts        # sac à 4 emplacements, compteurs +/-, outil au choix, résumé des coûts
src/preparation.css
tests/scenario/loadout.test.ts
```

#### Fichiers à modifier

```
src/modules/scenario/core/act-moon.ts               # préparation de la mission excavator
src/modules/scenario/core/campaign.ts               # confirmLoadout enregistre le loadout ; skipMission
src/modules/scenario/ui/briefing-router.view.ts     # étape preparation → preparation.view
briefing.html                                       # feuille src/preparation.css
DATA.md                                             # valeurs de jeu de l'équipement
CHANGELOG.md / CHANGELOG.fr.md, RELEASES.md / RELEASES.fr.md
```

#### Détails

Équipement de la sortie près de l'excavateur (valeurs de jeu, documentées dans `DATA.md`) :

| Objet | Emplacements | Stock | Effet | Coût sur la base |
|---|---|---|---|---|
| Oxygen bottle | 1 chacune | 4 | 90 s de temps dehors chacune | 3 points d'air par bouteille entièrement utilisée, au prorata du temps passé |
| Spare robot battery | 1 chacune | 3 | +0,03 kWh pour le robot (une charge de départ) | 4 points d'électricité par 0,03 kWh réellement tirés par le robot |
| Tool : standard drums | 1 | 1 | creuse 1 kg/s, tambours 0,9 kW | aucun en plus |
| Tool : wide drums | 1 | 1 | creuse 1,6 kg/s, tambours 1,4 kW | aucun en plus, mais vide la batterie plus vite |

- Règles : sac de 4 emplacements ; exactement un outil ; au moins une bouteille (on ne sort pas sans air). Donc au plus 2 objets en plus de l'outil et d'une bouteille : le joueur arbitre entre temps dehors et énergie du robot. Aucun choix n'est gratuit : plus de bouteilles laisse moins de place aux batteries, les tambours larges creusent vite mais vident la batterie.
- Le stock disponible dépend de la base : une bouteille n'est proposée que si l'air de la base est au moins à 3 points, une batterie que si l'électricité est au moins à 4 points. Un objet indisponible est grisé avec sa raison.
- Le résumé affiche le temps dehors prévu et l'énergie du robot prévue, en clair (« 3 minutes outside · robot battery ×2 »).
- « Go! » (`confirmLoadout`) enregistre le loadout, passe en `ready` et lance le jeu (Partie 4.1). Tant que 4.1 n'est pas livrée, « Go! » ramène au tableau de bord en `ready`.
- Si la base ne peut fournir aucune bouteille, la mascotte l'explique et propose « Skip this mission » (`skipMission`) : résultat `unfinished`, aucune consommation.

#### Modèle de données

`Loadout = { tool: 'standardDrums' | 'wideDrums'; oxygenBottles: number; spareBatteries: number }`, déjà présent dans `CampaignState` depuis 1.1 (champ `loadout`). Validation au chargement : outil connu, `oxygenBottles` 1–4, `spareBatteries` 0–3, total des emplacements ≤ 4.

#### Statuts et transitions

Branchées : `preparation → ready` (`confirmLoadout`), `preparation → debrief` (`skipMission`).

#### Erreurs exposées

Loadout invalide (règle enfreinte) : « Go! » reste désactivé, la ligne fautive dit pourquoi (« Your bag is full », « Take at least one oxygen bottle », « Choose a tool »).

#### Migration et rétrocompatibilité

Une sauvegarde en `ready` sans loadout (créée avant 3.1) repasse en `preparation` au chargement.

#### Architecture

Règles et calculs dans `core/loadout.ts` (pur) ; la vue n'affiche que ce que renvoie `core`.

#### Sécurité

Aucun

#### Tests

`loadout.test.ts` : loadout valide ; sac plein ; aucune bouteille ; pas d'outil ; stock limité par les jauges de la base ; temps dehors et énergie prévus. `campaign.test.ts` : `confirmLoadout` en `preparation` enregistre et passe en `ready` ; `skipMission` produit un résultat `unfinished` sans consommation.

#### Observabilité

Aucun

#### Performance

Aucun

#### Accessibilité

Compteurs avec boutons « − » / « + » libellés (« Remove an oxygen bottle »), valeur annoncée en `aria-live` ; outil en boutons radio ; raisons d'indisponibilité lisibles, pas seulement une couleur.

#### Critères d'acceptation

- Après l'académie, le joueur compose son sac : il ne peut pas dépasser 4 emplacements, ni partir sans bouteille ni outil, et voit pourquoi.
- Le temps dehors et l'énergie du robot prévus changent quand il ajoute ou retire un objet.
- Avec une base presque vide en air, les bouteilles sont grisées et la mascotte propose de passer la mission.

---

## Partie 4 — Mission excavateur, débrief et fin de journée

### 4.1 — Launch mission prend le contrôle de l'excavateur, puis la mascotte débriefe la consommation (9h)

#### Fichiers à créer

```
src/modules/scenario/core/scoring/excavator.ts      # résultat de la mission excavateur
src/modules/scenario/core/scoring/verdict-text.ts   # explication de la mascotte selon verdict et causes
src/modules/scenario/core/mission-route.ts          # où mène Launch mission selon l'étape et la mission
src/modules/scenario/ui/debrief.view.ts             # mascotte, verdict, consommation par jauge, Retry / Continue
src/modules/planet-walk/core/excavator/excavator-setup.ts   # caractéristiques du robot issues du loadout
src/modules/planet-walk/ui/controls/mission-hud.ts          # temps dehors restant, kg livrés / objectif, Finish mission
src/debrief.css
tests/scenario/excavator-scoring.test.ts
tests/scenario/mission-route.test.ts
tests/planet-walk/excavator-setup.test.ts
```

#### Fichiers à modifier

```
src/modules/planet-walk/core/excavator/excavator-power.ts   # EXCAVATOR devient la configuration par défaut ; stepExcavatorStore reçoit la configuration
src/modules/planet-walk/ui/controls/excavator-driving.ts    # configuration et charge de départ injectées
src/modules/planet-walk/ui/planet-walk.view.ts              # option mission : démarre au volant, monte le HUD de mission, appelle onMissionEnd
src/planet-walk.ts                                          # lit la partie (infra scenario) : étape ready + mission excavator → mode mission
planet-walk.html                                            # conteneur #mission-hud
src/modules/scenario/core/act-moon.ts                       # jeu et notation de la mission excavator
src/modules/scenario/core/campaign.ts                       # recordResult applique la consommation aux jauges
src/modules/scenario/ui/dashboard.view.ts                   # Launch mission suit mission-route
src/modules/scenario/ui/briefing-router.view.ts             # étapes debrief et dayEnd
briefing.html                                               # feuille src/debrief.css
DATA.md                                                     # règles de conversion en points de jauge et seuils de verdict
CHANGELOG.md / CHANGELOG.fr.md, RELEASES.md / RELEASES.fr.md
```

#### Détails

- `mission-route.ts` : étape `briefing` → académie ; `academy` → académie ; `preparation` → préparation ; `ready` → jeu de la mission (`/planet-walk.html` pour l'excavateur, `/mission.html` pour un mini-jeu, voir 5.1) ; `debrief` → débrief. C'est le seul endroit qui décide où mène Launch mission : le même bouton prend le contrôle du robot ou lance le mini-jeu.
- Mode mission de la 3D : `src/planet-walk.ts` lit la partie ; si l'étape est `ready` et la mission courante est `excavator`, la page démarre au volant du robot, à côté de l'astronaute, avec la configuration du loadout (outil, charge de départ + batteries de secours). Sinon, exploration libre (Back depuis le tableau de bord) : pas de HUD de mission, excavateur non pilotable.
- HUD de mission : temps dehors restant (bouteilles × 90 s, décompté en continu), régolithe livré / 50 kg, batterie du robot, bouton « Finish mission ». La tempête magnétique existante reste active.
- Fin de mission, un seul chemin : « Finish mission », E (quitter le robot), temps dehors écoulé, ou batterie vide sans régolithe à bord. La page calcule le résultat, appelle `recordResult`, sauvegarde, puis ouvre `/briefing.html` (débrief). Si la page est fermée avant la fin, l'étape reste `ready` : relancer rejoue la mission depuis le début, sans consommation enregistrée.
- Notation excavateur (`scoring/excavator.ts`) :
  - `objectiveShare = min(livré / 50 kg, 1)`.
  - air consommé = 3 × (secondes dehors / 90) points ; électricité consommée = 4 × (kWh tirés par le robot / 0,03) points ; eau gagnée = 1 point par 10 kg livrés (glace du régolithe).
  - verdict : objectif non atteint → `unfinished` ; atteint et air + électricité ≤ 10 points → `efficient` ; sinon `wasteful`.
  - `details` : kg livrés, secondes dehors, kWh tirés, outil.
- Débrief (`debrief.view.ts`) : la mascotte annonce le verdict, montre la variation de chaque jauge (avant → après), puis explique la cause principale avec `verdict-text.ts` : trop de temps dehors (air), trop de route ou tambours larges (électricité), objectif manqué et pourquoi (temps écoulé, batterie vide). Elle relie à la réalité (« Real rovers plan every move, because every watt counts. »).
- Après le débrief : « Retry the mission » (`retryMission` : retour en préparation ; ce qui a été consommé le reste, la mascotte le dit) ou « Continue » (`continueAfterDebrief`). Un verdict `efficient` ne propose que Continue.
- `continueAfterDebrief` sur la dernière mission du jour passe en `dayEnd`. Tant que 4.2 n'est pas livrée, `dayEnd` affiche la mascotte (« That's it for today! ») et le récapitulatif du jour, avec New game.

#### Modèle de données

`MissionResult` (défini en 1.1) est rempli ; `recordResult` ajoute le résultat à `history`, le met dans `lastResult`, et applique `used` à `stores` (bornes 0–100). Configuration du robot :

```ts
type ExcavatorConfig = {
  batteryKwh: number; startChargeKwh: number; drivingKw: number;
  drumKw: number; loadKg: number; digKgPerSecond: number; unloadKgPerSecond: number;
};
```

`EXCAVATOR` devient `DEFAULT_EXCAVATOR: ExcavatorConfig` ; `excavatorConfigFor(loadout)` renvoie la configuration de la mission (capacité = charge de départ + 0,03 kWh par batterie de secours).

#### Statuts et transitions

Branchées : `ready → debrief`, `debrief → preparation | ready | briefing | dayEnd`.

#### Erreurs exposées

Aucune erreur affichée : une partie en étape autre que `ready` qui ouvre la 3D obtient simplement l'exploration libre.

#### Migration et rétrocompatibilité

`stepExcavatorStore` reçoit désormais la configuration : tous ses appelants (seulement `excavator-driving.ts`) sont basculés dans la même sous-partie, l'ancienne constante n'est plus exportée sous son ancien nom.

#### Architecture

- `planet-walk` ne dépend pas de `scenario` : `src/planet-walk.ts` (point d'entrée) lit la partie, construit l'option `mission: { config, outsideSeconds, goalKg, onMissionEnd }` et la passe à `mountPlanetWalk`. Le module 3D renvoie des mesures brutes, la notation reste dans `scenario/core/scoring`.
- Course « écrire puis naviguer » : `save` est synchrone ; si l'écriture échoue (quota), la navigation a lieu quand même et le débrief s'affiche à partir du résultat passé dans l'URL de retour (`/briefing.html#result=<json encodé>`), relu puis effacé de l'URL par le routeur.

#### Sécurité

Le résultat passé dans l'URL de secours est validé comme une sauvegarde (bornes, verdict connu) avant usage.

#### Tests

`excavator-scoring` : objectif atteint sobre → `efficient` ; atteint gourmand → `wasteful` ; non atteint → `unfinished` ; bornes (0 kg, 50 kg pile, temps nul). `mission-route` : chaque étape mène au bon écran, mission 3D vs mini-jeu. `excavator-setup` : outil et batteries changent la configuration. `campaign` : `recordResult` applique la consommation et borne les jauges ; `retryMission` garde la consommation ; Continue sur la dernière mission mène à `dayEnd`.

#### Observabilité

`console.info('[scenario] mission result', { missionId, verdict, used })` à l'enregistrement.

#### Performance

Le HUD se met à jour au plus 10 fois par seconde (pas à chaque image).

#### Accessibilité

HUD lisible (contraste ≥ 4.5:1 sur la 3D grâce au fond du panneau), temps restant annoncé en `aria-live` à 30 s et 10 s seulement ; débrief : variations de jauge écrites en texte (« Air: 100 % → 94 % »), pas seulement en barre.

#### Critères d'acceptation

- Depuis le tableau de bord prêt, Launch mission ouvre la 3D directement aux commandes du robot, avec le temps dehors et la batterie choisis en préparation.
- Quand le joueur termine (bouton, E, temps écoulé, batterie vide), il revient sur la mascotte qui annonce le verdict et montre ce qui a été consommé en air, électricité et eau.
- Un joueur qui a beaucoup roulé obtient `wasteful` et l'explication parle de l'électricité.
- Retry ramène en préparation avec les jauges déjà entamées ; Continue passe à la suite.
- Fermer la 3D en cours de mission puis revenir : la mission se rejoue sans consommation enregistrée.
- Back depuis le tableau de bord ouvre toujours l'exploration libre, sans HUD de mission.

### 4.2 — Écran de transition de journée et fin d'acte (4h)

#### Fichiers à créer

```
day.html                                        # titre de journée générique (remplace day-one.html)
src/day.ts
src/modules/scenario/ui/day-title.view.ts      # titre animé + cartes de statut issues du contenu
src/modules/scenario/ui/act-end.view.ts        # mascotte, récapitulatif des missions, New game
tests/scenario/day-title.test.ts               # titre et destination selon l'étape
```

#### Fichiers à modifier

```
src/modules/scenario/core/scenario-content.ts   # Day : title ('Day one', 'Day two', 'Some time later'…), statusCards
src/modules/scenario/core/act-moon.ts           # jour 1 : cartes de statut ; jour 2 : titre « Day two », sans mission
src/modules/scenario/ui/briefing-router.view.ts # dayEnd → /day.html ; actEnd → act-end.view
src/moon-intro.ts                               # fin de cinématique → /day.html
src/day-one.css → src/day.css                   # renommé, classes day-one__ → day__
vite.config.ts                                  # entrée day à la place de dayOne
CLAUDE.md                                       # architecture : day.html
CHANGELOG.md / CHANGELOG.fr.md, RELEASES.md / RELEASES.fr.md
```

Supprimé : `day-one.html` (remplacé par `day.html`, toutes ses références basculées).

#### Détails

- `day.html` lit la partie : en étape `briefing` du jour 1 (arrivée depuis la cinématique), il affiche le titre du jour courant ; en étape `dayEnd`, le titre du jour suivant (« Day two »). Continue appelle `startNextDay` (en `dayEnd`) puis ouvre le tableau de bord.
- Le titre de transition vient du contenu : « Day two », « Some time later », « A few days later »… L'acte Lune déclare un jour 2 titré « Day two » sans mission : `startNextDay` y mène en `actEnd`, qui affiche la mascotte (merci, récapitulatif des verdicts du jour, ce qui vient ensuite dans l'histoire) et New game. Ajouter un jour = ajouter du contenu, sans code.
- Cartes de statut du jour 1 : celles de la maquette Day One, avec la valeur de température corrigée après relecture scientifique (aujourd'hui « -150 °C » avec « daylight », incohérent : la valeur de jour retenue est notée dans `DATA.md`).

#### Modèle de données

`Day` gagne `title: string` et `statusCards: { value: string; label: string }[]` (contenu, non persisté).

#### Statuts et transitions

Branchées : `dayEnd → briefing | actEnd` (`startNextDay`), `actEnd → briefing` (`newCampaign`).

#### Erreurs exposées

Aucun

#### Migration et rétrocompatibilité

Les liens vers `/day-one.html` (cinématique) sont basculés vers `/day.html` dans la même sous-partie. Un ancien favori vers `/day-one.html` tombe sur l'accueil (fallback nginx `try_files`).

#### Architecture

`day.ts` câble `infra/campaign-storage` et `ui/day-title.view` comme `briefing.ts`.

#### Sécurité

Aucun

#### Tests

`day-title` : en `briefing` jour 1, titre « Day one » ; en `dayEnd`, titre du jour suivant ; Continue en `dayEnd` mène au tableau de bord du jour suivant ou à la fin d'acte.

#### Observabilité

Aucun

#### Performance

Aucun

#### Accessibilité

Titre en `h1`, animation coupée avec `prefers-reduced-motion`, bouton Continue focalisé à la fin de l'animation.

#### Critères d'acceptation

- La cinématique d'alunissage mène à « Day one », puis au tableau de bord.
- Après la dernière mission du jour, Continue affiche « Day two », puis la mascotte de fin d'acte avec le récapitulatif et New game.
- Les cartes de statut du jour 1 ne se contredisent plus (température cohérente avec le jour lunaire).

---

## Partie 5 — Mission laser

### 5.1 — Deuxième mission du jour 1 : envoyer les données vers la Terre avec le jeu des miroirs laser (4.5h)

#### Fichiers à créer

```
mission.html                                    # page qui héberge le mini-jeu de la mission courante
src/mission.ts
src/modules/scenario/ui/mission-game.view.ts    # démarre le MiniGame, Back vers la 3D, fin → recordResult
src/modules/scenario/core/scoring/laser.ts
tests/scenario/laser-scoring.test.ts
```

#### Fichiers à modifier

```
src/modules/scenario/core/act-moon.ts           # mission laser : accueil, académie, jeu 'laser-mirrors', notation
src/modules/scenario/core/scenario-content.ts   # GameRef : { kind: 'walk' } | { kind: 'minigame'; id }
vite.config.ts                                  # entrée mission
DATA.md                                         # coût en électricité du laser (valeur de jeu)
CHANGELOG.md / CHANGELOG.fr.md, RELEASES.md / RELEASES.fr.md
```

#### Détails

- Jour 1 = mission `excavator` puis mission `laser-comms` : « Send today's data to Earth ». Pas de préparation (la mission se fait depuis la base) : académie → `ready`.
- Académie (faits sourcés, relus avec `junior-mission-review`) : la Terre est à environ 384 400 km, la lumière met environ 1,3 s à faire le trajet ; en 2013 l'expérience LLCD de la NASA (sonde LADEE) a envoyé des données de la Lune vers la Terre par laser à 622 Mbit/s ; un laser envoie beaucoup plus de données qu'une radio mais doit viser très précisément, d'où les miroirs.
- `mission.html` trouve le mini-jeu par l'id de la mission courante dans `MINI_GAMES` et le démarre ; si l'étape n'est pas `ready` ou si la mission n'est pas un mini-jeu, la page renvoie au tableau de bord.
- Notation laser : électricité consommée = 2 + (100 − score) / 10 points ; `won` faux (le joueur quitte) → `unfinished` ; score ≥ 70 → `efficient` ; sinon `wasteful`. `details` : score, gagné ou non.
- Quitter le mini-jeu (bouton Back de la page) ouvre la 3D en exploration libre, sans résultat ; la mission reste `ready`.
- Fin du jeu → `recordResult` → débrief (4.1) → Continue → `dayEnd` (4.2).

#### Modèle de données

`Mission.game` devient `GameRef = { kind: 'walk' } | { kind: 'minigame'; id: string }` ; la mission excavator est basculée en `{ kind: 'walk' }`.

#### Statuts et transitions

Aucun nouveau statut ; le jour 1 a maintenant deux missions, donc `debrief → briefing` (mission suivante) est exercé.

#### Erreurs exposées

Id de mini-jeu inconnu dans le contenu : la page revient au tableau de bord et `console.error('[scenario] unknown mini-game', { id })` (erreur de contenu, attrapée aussi par un test).

#### Migration et rétrocompatibilité

Une sauvegarde qui avait terminé le jour 1 avant 5.1 (en `dayEnd` ou `actEnd`) reste valide : l'index de mission est relu contre le contenu, un index au-delà du nombre de missions est traité comme fin de jour.

#### Architecture

`scenario/ui/mission-game.view.ts` importe le registre `MINI_GAMES` (UI vers UI d'un autre module, contrat `MiniGame` de `minigames/core`). Le mini-jeu n'est pas modifié.

#### Sécurité

Aucun

#### Tests

`laser-scoring` : gagné bon score, gagné mauvais score, abandon. `campaign` : jour 1 complet en deux missions. Test de contenu : chaque mission `minigame` référence un id présent dans `MINI_GAMES`.

#### Observabilité

Même journal de résultat que 4.1.

#### Performance

Aucun

#### Accessibilité

Celle du mini-jeu existant ; la page ajoute un titre de mission en `h1` et un bouton Back libellé « Back to the base ».

#### Critères d'acceptation

- Après le débrief de l'excavateur, Continue mène au tableau de bord de la mission laser, avec le texte d'accueil de la mascotte.
- Launch mission, après l'académie, lance directement le jeu des miroirs (même bouton que pour le robot).
- Beaucoup de bascules de miroirs donnent `wasteful` et la mascotte parle de l'électricité du laser.
- Après cette mission, la journée se termine sur « Day two ».

---

## Flow complet

1. Accueil → Start playing → sélection d'acte → carte Moon → cinématique → **Day one** (`day.html`) → tableau de bord.
2. Tableau de bord, étape `briefing` : la mascotte accueille (« Hello, welcome to the station… », plusieurs pages), puis objectif du jour et trois jauges.
3. **Launch mission** → académie de la mission (faits réels sourcés) → « I'm ready ».
4. Préparation si la mission sort de la base (sac à 4 emplacements, outil, bouteilles, batteries) → « Go! ».
5. Jeu : excavateur piloté en 3D (`planet-walk.html` en mode mission) ou mini-jeu (`mission.html`).
6. Fin du jeu → débrief de la mascotte : verdict, consommation air / électricité / eau, cause expliquée → Retry ou Continue.
7. Mission suivante du jour (retour au 2.) ou fin de journée → **Day two** → fin d'acte (récapitulatif, New game).
8. À tout moment depuis le tableau de bord, **Back** ouvre la 3D en exploration libre ; dans la 3D, E au terminal ou Back ramène au tableau de bord. Depuis un mini-jeu, Back ouvre la 3D.
9. La partie est gardée dans le navigateur à chaque étape ; New game repart du jour 1.

## Résumé des temps

| Sous-partie | Titre | Estimation |
|---|---|---|
| 1.1 | Tableau de bord template, mascotte, jauges, sauvegarde, Vitest | 8h |
| 1.2 | Le terminal 3D ramène au tableau de bord | 2.5h |
| 2.1 | Académie expliquée par la mascotte | 4h |
| 3.1 | Préparation : outil, bouteilles, batteries | 5h |
| 4.1 | Mission excavateur en 3D et débrief | 9h |
| 4.2 | Transition de journée et fin d'acte | 4h |
| 5.1 | Mission laser (mini-jeu) | 4.5h |
| **Total** | | **37h** |

## Dépendances techniques

- `vitest` ^4.1 (compatible Vite 8) et `jsdom` ^27, en devDependencies, versions exactes figées par `pnpm-lock.yaml` à l'installation.
- Aucun service externe, aucune clé.
- Images : `public/game-design/mascotte.png` et le cadre de bulle, recadrés et allégés vers `public/arcadia/` (fond transparent vérifié à l'export).

## Ordre d'implémentation recommandé

1. **1.1** : état de partie, sauvegarde, tableau de bord template (tout le reste en dépend).
2. **1.2** : terminal 3D → tableau de bord (indépendant du reste, retire le tableau de bord dans la scène avant que 4.1 touche la 3D).
3. **2.1** : académie.
4. **3.1** : préparation (le loadout est lu par 4.1).
5. **4.1** : mission excavateur et débrief.
6. **4.2** : transition de journée et fin d'acte (consomme `dayEnd` produit par 4.1).
7. **5.1** : mission laser (consomme le débrief de 4.1 et la fin de journée de 4.2).
