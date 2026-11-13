# Game Design — brouillon v0

> Document de travail de l'équipe. Tout est discutable. Les chiffres et références marqués **(à vérifier)** doivent être confirmés sur une source NASA avant d'entrer dans le jeu.

## Pitch

Un jeu de préparation de mission jouable dans le navigateur (Three.js), pour les 7–12 ans. Le joueur remplit la **soute** d'une mission (inventaire en grille) avec des modules qui se **combinent** en technologies plus puissantes. Sa base doit ensuite survivre seule au **voyage** puis à la **planète**, face à la **vraie météo spatiale** tirée des archives NASA. À chaque échec, un **débrief** explique ce qui a lâché et pourquoi, et donne envie de réessayer.

Inspiration de genre : inventaire en grille + résolution automatique. Nos règles, nos objets et notre direction artistique sont originaux.

## Principes (rappel de l'énoncé)

- Aucun choix gratuit : chaque objet coûte de la place, du budget ou de l'énergie.
- Trois ressources seulement : **Énergie**, **Support de vie** (O₂ + nourriture), **Dose de radiation**.
- Des données NASA réelles, attribuées dans le jeu, sans jamais présenter des données archivées comme du live.
- Langage simple, et chaque terme technique expliqué en une phrase.
- L'échec apprend sans punir.

## Déroulé d'une partie

### 1. Préparation (Terre)
- **Briefing de mission** : la destination (Lune ou Mars) et ses contraintes sont annoncées **avant** les achats. Tout l'intérêt est de préparer la soute en fonction de l'endroit où l'on va, comme le font les vrais planificateurs de mission.
- Soute vide, budget limité, boutique aléatoire.
- **Seule occasion d'acheter.** Ce qui manque manquera.

### 2. Voyage
- Pas de boutique : aucun ravitaillement possible dans l'espace.
- Aucune protection naturelle : les événements DONKI frappent fort.
- La résolution est automatique ; **entre deux événements** (étapes du voyage), le joueur peut seulement réorganiser et fusionner.
- On compte en **jours**, pas en sols : « sol » ne s'applique qu'à Mars.

### 3. Planète
- Contraintes locales (voir tableau).
- **Ressources locales gratuites** (régolithe, glace, CO₂). C'est l'ISRU : vivre de ce qu'on trouve sur place.

La résolution est automatique : une fois la phase lancée, le joueur n'intervient plus. **C'est volontaire** : ça représente le délai de communication. La Terre ne peut pas piloter la base en direct, donc tout se joue dans la préparation.

## Destinations

| | Lune (pôle Sud, Artemis) | Mars |
|---|---|---|
| Protection naturelle | Aucune (ni atmosphère ni magnétosphère) | Faible (atmosphère fine) |
| Énergie | Nuit d'environ 14 jours terrestres ; au pôle Sud, certains sommets sont éclairés presque en permanence (le site choisi compte) | Soleil à ~43 % de celui de la Terre, poussière (InSight : de 5 000 à 500 Wh par sol) |
| Délai de communication | ~1,3 s | 4 à 24 min |
| Ressources locales | Régolithe, glace des cratères d'ombre | Régolithe, CO₂, glace |
| Durée du voyage | ~3 jours | 7 à 10 mois |
| Données | DONKI, Moon Trek | DONKI, InSight, Mars Trek |
| Objets favorisés | Batteries, blindage | Batteries, serre, conversion du CO₂ |

## Catalogue d'objets (v1)

**Principe** : plus d'objets, mais **pas plus de concepts**. Chaque objet agit sur les 3 jauges (Énergie, Support de vie, Dose) et/ou sur les ⭐ de science. La boutique n'en montre que 4–5 à la fois : le catalogue peut être large sans surcharger le joueur.

★ = proposé pour le MVP de samedi (~10 objets). Les autres arrivent dimanche matin si la boucle tient. Chaque fait cité est sourcé dans `DATA.md` (vérifié le 2026-11-13).

### ⚡ Énergie

| Objet | Apporte | Coûte / limite | Mauvais choix quand | Fait réel |
|---|---|---|---|---|
| ★ Panneau solaire | Beaucoup d'énergie le jour | 2 cases ; rien la nuit ni sous la poussière ; 43 % de sa puissance sur Mars | Tempête de poussière sans batterie | InSight : la poussière a fait chuter sa production de 5 000 à 500 Wh par sol |
| Panneau déroulable | Énergie dans peu de place | Cher | Petit budget | ROSA / iROSA sur l'ISS : se roule « comme un tapis » pour le lancement, presque moitié plus petit que les anciens panneaux |
| ★ Batterie | Stocke l'énergie pour la nuit | 1 case ; ne produit rien | Trop de batteries, pas assez de production | – |
| Générateur nucléaire | Énergie constante, jour et nuit, insensible à la poussière | Très cher, lourd, faible puissance, perd quelques % par an | Besoin de beaucoup d'énergie d'un coup | MMRTG de Curiosity et Perseverance : ~110 W, « autant qu'une ampoule » |
| Pile à combustible | Énergie **+ eau potable en bonus** | Consomme de l'O₂ et de l'hydrogène emportés | O₂ déjà juste | Apollo et la navette : l'eau produite servait à boire |

### 🫁 Support de vie

| Objet | Apporte | Coûte / limite | Mauvais choix quand | Fait réel |
|---|---|---|---|---|
| ★ Réserve d'O₂ | O₂ immédiat, secours | S'épuise, ne se renouvelle pas | Mission longue | ISS : réservoirs et « bougies » d'oxygène en secours |
| ★ Électrolyseur | O₂ renouvelable | Beaucoup d'énergie + de l'eau | Énergie ou eau trop justes | ISS : l'oxygène est fabriqué en cassant de l'eau avec de l'électricité |
| Filtre à CO₂ | Garde l'air respirable | Énergie ou cartouches à remplacer | Mission très courte | Apollo 13 : filtres carrés, trous ronds, réparation en carton, sacs et scotch. ISS : système CDRA |
| Recycleur d'eau | Récupère presque toute l'eau | Énergie, 1 case | Mission très courte | ISS : 98 % de l'eau recyclée, sueur et urine comprises |
| ★ Rations | Nourriture immédiate (et blindage d'appoint, voir abri) | Cases ; s'épuisent | Mission longue | Orion : l'équipage s'abrite derrière des sacs de nourriture et d'eau |
| ★ Serre | Nourriture durable | Énergie + eau ; lente ; **presque pas d'O₂** | Mission courte | Veggie (laitue mangée en 2015). Pour l'O₂ d'un seul astronaute, il faudrait un jardin grand comme une salle de classe |
| Convertisseur de CO₂ (Mars) | O₂ tiré de l'air martien | Énergie ; production très faible | Énergie juste | MOXIE : 122 g d'O₂ en tout, une démonstration |

### 🛡️ Radiation

| Objet | Apporte | Coûte / limite | Mauvais choix quand | Fait réel |
|---|---|---|---|---|
| ★ Réservoir d'eau | Blindage + eau | Lourd, 2 cases ; l'eau sert aussi à boire et à l'O₂ | Un seul réservoir pour trois usages | L'eau et les matériaux riches en hydrogène bloquent bien les particules |
| Plaques de polyéthylène | Blindage léger | Ne sert qu'à ça | Période solaire calme | Mesures sur l'ISS (ALTEA) : les matériaux riches en hydrogène protègent le mieux |
| Dosimètre | L'équipage **se met à l'abri automatiquement** quand la dose monte | 1 case, aucune protection directe | Pas d'abri à bord | Dosimètres actifs sur l'ISS ; l'équipe SRAG de la NASA surveille le Soleil et dit aux astronautes quand s'abriter |
| Imprimante à régolithe (surface) | Murs de blindage avec la poussière locale | Énergie + temps de construction (valeurs inventées, voir `DATA.md`) | Mission courte | MMPACT : la NASA développe l'impression de pistes et d'habitats en régolithe lunaire |

### 🔬 Science (l'objectif de mission)

| Objet | Apporte | Coûte / limite | Mauvais choix quand | Fait réel |
|---|---|---|---|---|
| ★ Labo | ⭐ | Énergie ; n'aide pas à survivre | Marge de survie trop faible | – |
| Rover / sortie d'exploration | Beaucoup de ⭐ | L'équipage dehors est plus exposé aux radiations | Tempête solaire en cours | La NASA planifie les sorties selon la météo spatiale |
| ★ Antenne relais | Les ⭐ ne comptent **que si elles sont transmises** | Énergie ; transmission retardée | Énergie juste | Perseverance envoie 99,9 % de ses données via des satellites en orbite (MRO, MAVEN, TGO), reçues par le Deep Space Network |
| Vélo d'exercice | Équipage en forme → plus de ⭐ | Énergie + 1 case | Mission très courte | ISS : 2 h de sport par jour, et on perd quand même ~1 % d'os par mois (cartes santé OSDR) |

### Multiplier la variété sans multiplier les objets

- **Formes** : 1×1, 1×2, en L, 2×2. La soute devient un casse-tête spatial, sans concept nouveau.
- **Niveaux** : deux objets identiques fusionnent en niveau 2.
- **Voisinage** : batterie à côté d'un panneau, serre à côté d'un recycleur…
- **Modificateurs par destination** : panneau à 43 % sur Mars, longue nuit sur la Lune, convertisseur de CO₂ seulement sur Mars.

### Technique

Les objets sont décrits dans un **fichier JSON** (forme, coût, effets, texte enfant, fait réel, lien source), lu par `core/`. Ajouter un objet = ~10 minutes, pas de code. Chaque nouvel objet passe par `junior-mission-review` (coût, cas de mauvais choix, source).

## Fusions (une fusion = une vraie technologie)

Le **Module habitat** n'est pas acheté : c'est le module de base, déjà placé dans la soute au départ (il prend des cases). Il sert de partenaire de fusion pour l'Abri.

| A | + B | = Fusion | Référence réelle (sources dans `DATA.md`) |
|---|---|---|---|
| Panneau solaire | Batterie | Micro-réseau | Stockage d'énergie des bases solaires |
| Réservoir d'eau | Habitat | Abri anti-tempête | L'eau bloque bien les particules ; sur Orion, l'équipage s'abrite derrière des sacs de nourriture et d'eau |
| Eau | Électrolyseur | Générateur d'O₂ | Système de production d'O₂ de l'ISS |
| Serre | Recycleur d'eau | Support de vie biologique | Veggie (ISS), kit CSA « Food production on the Moon » |
| Régolithe | Imprimante 3D | Murs en régolithe | MMPACT : impression 3D avec du régolithe lunaire (Mars Dune Alpha, lui, est en béton imprimé sur Terre) |
| CO₂ martien | Convertisseur de CO₂ | Oxygène martien | MOXIE (Perseverance) : démonstration, 122 g d'O₂ en tout |

Règles :
- Une fusion **se découvre** : l'objet brille quand un partenaire compatible est adjacent.
- Une fusion libère de la place mais **a un coût** (souvent de l'énergie).
- Le texte de la fusion raconte la vraie technologie en une ou deux phrases.

## Difficulté : Facile / Moyen / Difficile

Règle d'or : **la difficulté ne fausse jamais la physique.** On ne rend pas la radiation « moins dangereuse » en Facile. On change les conditions de la mission, comme le ferait un vrai planificateur.

| Levier | Facile | Moyen | Difficile |
|---|---|---|---|
| **Période solaire tirée dans DONKI** | Peu de tempêtes de particules (SEP) | Période mixte | Beaucoup de SEP (maximum solaire, annoncé en octobre 2024) |
| Budget et taille de la soute | Généreux | Standard | Serrés |
| Durée de la mission (sols sur place) | Courte | Moyenne | Longue |
| Aides | Les fusions brillent, conseils au briefing | Les fusions brillent | Fusions à découvrir seul |
| Destination par défaut | Lune | Lune ou Mars | Mars |

**Bonus pédagogique** : le premier levier enseigne le **cycle solaire** (environ 11 ans) et la date de lancement. **Attention, piège scientifique** : un Soleil calme envoie moins de tempêtes, mais laisse passer **plus de rayons cosmiques** (le vent solaire les repousse moins). Le « Soleil calme » n'est donc pas « sans danger » : c'est un arbitrage (moins de pics, plus de fond). Les périodes d'archive se choisissent selon le **nombre de SEP**, pas la vitesse des CME (ce sont les particules qui font la dose).

## Aléatoire et rejouabilité

1. La destination, qui change d'une partie à l'autre mais est toujours annoncée au briefing.
2. La boutique (sélection différente à chaque partie).
3. La **météo cosmique** : une vraie séquence DONKI (CME, SEP, éruptions) tirée d'une fenêtre de dates archivée. La difficulté se règle avec le nombre de tempêtes de particules (SEP) de la période tirée.
4. Les conditions locales : des sols InSight réels, plus ou moins froids.

Un même événement est atténué différemment selon le lieu : fortement en orbite terrestre, un peu sur Mars, pas du tout sur la Lune ni pendant le voyage.

Texte à afficher pour rester honnête : *« Événement réel observé le JJ/MM/AAAA (NASA DONKI), imaginé ici frappant ta base. »*

## Échec et débrief : le cœur pédagogique

On ne dit jamais seulement « Game over ». Chaque échec répond à quatre questions.

### 1. Qu'est-ce qui a lâché ?
La ressource qui a atteint zéro (ou la dose qui a dépassé la limite), avec le moment : *« Jour 4 du voyage : l'oxygène est tombé à zéro. »*

### 2. Pourquoi ? (la chaîne de causes)
On remonte la chaîne, en 2 ou 3 étapes maximum, illustrées :
> ☀️ Une vraie tempête de particules solaires (SEP du JJ/MM/AAAA) → 🛡️ l'équipage s'est réfugié dans l'abri et le chauffage a tourné à fond → 🔋 ta batterie s'est vidée → 💨 l'électrolyseur s'est arrêté → plus d'oxygène.

### 3. Qu'est-ce qui aurait aidé ? (le contrefactuel)
La simulation est **déterministe** (graine fixée), donc on peut rejouer en coulisse la même mission avec une seule modification et montrer le résultat réel, pas un conseil générique :
> *« Avec une batterie de plus à côté de ton panneau solaire, ta base aurait tenu jusqu'au sol 9. »*

### 4. Le lien avec la vraie vie
Une carte « Ce que font les vrais astronautes » (source NASA / OSDR) :
> *« Sur l'ISS, l'oxygène est fabriqué en cassant de l'eau avec de l'électricité. Sans énergie, pas d'oxygène : c'est pour ça que les ingénieurs prévoient toujours des réserves. »*

### Pour donner envie de recommencer
- **Bouton « Retenter la même mission »** (même météo, même boutique) : le joueur teste directement son idée. C'est la boucle d'apprentissage principale.
- Afficher aussi **ce qui a bien marché** (« ton abri anti-tempête a sauvé l'équipage pendant 2 tempêtes ! »).
- **Mission partielle** plutôt que défaite sèche : on survit N sols sur M, avec des étoiles.
- **Carnet de découvertes** : chaque fusion découverte, et chaque leçon apprise par un échec, débloque une fiche. Une collection à compléter.

### Conséquence technique
Le moteur de simulation doit **journaliser chaque flux de ressource et sa cause** (quel objet a consommé quoi, à cause de quel événement). Sans ce journal, impossible de construire la chaîne de causes. Il tourne indépendamment du rendu Three.js, ce qui permet de lancer le contrefactuel en coulisse et de tester l'équilibrage.

## Propositions de revue (à trancher à 9 h)

Issues d'une revue critique du design. Ce sont des **propositions**, pas des décisions.

1. **Objectif de mission : un Labo science qui rapporte des étoiles.** Sans objectif, « tout en blindage » est le choix sûr. L'énoncé demande de peser la science contre la sécurité.
2. **MVP sur Mars uniquement.** Le délai de 4 à 24 min justifie vraiment la résolution automatique (sur la Lune, il n'est que de 1,3 s), et on a InSight, MOXIE et les sols. La Lune passe en extension.
3. **Grille et interface en DOM/CSS**, avec Three.js en décor optionnel. Un glisser-déposer en DOM se fait en quelques heures, en Three.js plutôt en une journée.
4. **Une première mission scriptée** (boutique et événements fixes) qui mène au débrief en ~90 secondes, pour qu'un enfant de 7 ans comprenne la boucle.
5. **Le réservoir d'eau comme dilemme phare** : il sert à l'Abri **et** au Générateur d'O₂. Fusionner l'un bloque l'autre.
6. **Dose = compteur qui ne fait que monter**, avec une ligne limite (modèle cumulatif réel).
7. **Durée** : 3 à 5 min par partie, première défaite possible en moins de 2 min.
8. **« Le Soleil cette semaine »** : une mission bonus construite sur des données DONKI récentes, pré-récupérées et étiquetées avec leur date de récupération. Ça répond au critère « météo spatiale actuelle » sans clé API dans le front.
9. **Usage en classe** : une graine de mission partageable par URL (toute la classe joue la même mission).
10. **Couvrir OSDR et RadLab** : 3 cartes santé rédigées à la main (avec leur OSD-xxx) et une dose de fond ISS.

### Objets du MVP

Voir le **Catalogue d'objets** : les objets marqués ★.

Fusions MVP : Micro-réseau, Abri anti-tempête, Générateur d'O₂, Support de vie biologique (+ Oxygène martien sur Mars, avec un coût en énergie). Imprimante 3D et régolithe : hors MVP.

**MVP dans l'ordre** : moteur déterministe avec journal causal → grille DOM, une destination, mission fixe → débrief en 4 questions avec contrefactuel réalisable → « Retenter » → page Sources + `DATA.md` → seconde période solaire.
**À couper dans l'ordre si on manque de temps** : boutique aléatoire, seconde destination, troisième difficulté, carnet de découvertes, Three.js.

## Questions ouvertes

1. Au briefing, est-ce que le joueur choisit la destination, ou est-ce qu'elle lui est assignée ?
2. Taille de la grille et budget : fixes ou dépendants de la destination ?
3. Premier niveau pour la démo (proposition : la Lune).
4. Limite de dose : comment la représenter simplement pour un enfant (jauge « bouclier de l'équipage » ?) tout en restant juste.
5. Durée d'une partie visée (proposition : 5 à 10 min).
6. La difficulté est-elle **indépendante** de la destination (Lune difficile possible) ou **liée** (Facile = Lune, Difficile = Mars) ?
