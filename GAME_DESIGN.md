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

## Objets (v0 : 6 à 8 de base)

Panneau solaire · Batterie · Réservoir d'eau · Module habitat · Électrolyseur · Serre · Recycleur d'eau · Imprimante 3D · Convertisseur de CO₂ (Mars uniquement)
Ressources locales (sur la planète uniquement) : Régolithe · CO₂ martien. **Elles ne sont pas gratuites** : les extraire coûte de l'énergie et l'outil qui les exploite prend une case (règle « aucun choix gratuit »).

## Fusions (une fusion = une vraie technologie)

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

### Liste d'objets proposée (MVP)

| Objet | Apporte | Coûte | Mauvais choix quand |
|---|---|---|---|
| Panneau solaire | Énergie le jour | 2 cases ; rien la nuit ni sous la poussière | Tempête de poussière sans batterie |
| Batterie | Stocke l'énergie | 1 case ; ne produit rien | Trop de batteries, pas assez de production |
| Réservoir d'eau | Eau (boire, O₂, blindage) | Lourd, 2 cases | Un seul réservoir pour trois usages |
| Électrolyseur | O₂ | Beaucoup d'énergie + de l'eau | Énergie trop juste |
| Rations | Nourriture immédiate | Cases ; s'épuisent | Mission longue |
| Serre | Nourriture durable | Énergie + eau ; production lente | Mission courte |
| Labo science | Étoiles (objectif) | Énergie ; n'aide pas à survivre | Marge de survie trop faible |

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
