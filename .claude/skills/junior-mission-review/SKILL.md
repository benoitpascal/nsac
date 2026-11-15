---
name: junior-mission-review
description: >
  Garde-fou pédagogique et scientifique du Junior Astronaut Mission Trainer (NASA Space Apps 2026).
  Vérifie que tout contenu du jeu est compréhensible par un enfant de 7–12 ans, qu'aucun choix
  n'est gratuit, que chaque donnée NASA est réelle, sourcée et honnêtement présentée (archivée vs
  live), et que chaque échec est expliqué. À utiliser dès qu'on écrit ou modifie un texte du jeu
  (objets, fusions, événements, briefing, débrief, tutoriel), qu'on ajoute un objet, une mécanique
  ou un chiffre « scientifique », qu'on branche une donnée NASA, ou avant une démo / un commit de
  contenu. Aussi pour « relis ça pour des enfants », « c'est juste scientifiquement ? »,
  « check data honesty », « review game text ».
---

# Junior Mission Review

Le jury juge trois choses en plus du fun : **un enfant comprend-il une vraie contrainte**, **la science est-elle juste**, **les données NASA sont-elles réelles et traçables**. Ce skill vérifie les trois. Il ne fait pas de game design général (voir `survival-crafting`, `roguelike`, `game-ui-ux`).

## Quand l'appliquer

- Nouveau texte affiché au joueur → passes 1 et 4.
- Nouvel objet, fusion, mécanique ou paramètre d'équilibrage → passes 2 et 3.
- Nouvelle donnée NASA (fetch, fichier archivé, chiffre cité) → passe 3.
- Nouvel état d'échec ou nouveau débrief → passe 4.
- Avant une démo → toutes les passes.

Pendant le hackathon, ne pas le lancer à chaque commit : faire une revue complète aux **points de contrôle** du plan (fin du jour 1, avant la démo), et des passes ciblées seulement sur un texte ou un objet nouveau.

## Passe 1 — Lisible par un enfant de 7–12 ans

- **Phrases courtes** : 15 mots max dans l'interface, une idée par phrase.
- **Mots du quotidien** d'abord. Un terme technique n'apparaît que s'il apprend quelque chose, et il est **expliqué en une phrase la première fois** (glossaire : `references/glossary.md`).
- **Concret et comparé** : une comparaison du quotidien plutôt qu'une unité (« mSv »). La comparaison doit elle-même être **exacte et sourcée** : reprendre de préférence celle que la NASA publie (ex. « autant que N radios des poumons » quand un article NASA le dit), ne jamais en fabriquer une.
- **Tutoiement, ton encourageant**, on parle au joueur comme à un·e jeune commandant·e.
- **Pas de peur ni de mort** : l'équipage n'est jamais montré mourant. Un échec = « mission interrompue, l'équipage rentre à l'abri / sur Terre ». La radiation est un risque pour la santé à limiter, pas une menace d'horreur.
- **Pas de lecture obligatoire longue** : un texte de plus de 3 lignes doit être découpé ou illustré.
- **Pas seulement la couleur** pour signaler un danger : icône + mot.
- ⛔ **Règle Space Apps** : aucune image, vidéo, audio ni ressemblance d'une personne de moins de 18 ans dans le jeu ni dans la démo (pas de photo ou voix d'enfant, pas d'enfant filmé en test). Personnages dessinés non réalistes uniquement.

Test rapide : lire le texte à voix haute comme à un enfant de 8 ans. Si on a envie d'ajouter « c'est-à-dire… », il faut réécrire.

## Passe 2 — Aucun choix gratuit

Pour chaque objet, fusion, action ou option, remplir :

| Élément | Ce qu'il apporte | Ce qu'il coûte | Quand il devient un mauvais choix |
|---|---|---|---|

- La colonne « coût » ne peut pas être vide. Les coûts possibles : place dans la soute, budget, énergie, eau, temps, risque.
- La colonne « mauvais choix » ne peut pas être vide non plus : sinon c'est un objet « toujours à prendre », donc pas de décision.
- Un effet **différé** est préférable à un effet immédiat quand c'est réaliste (économiser l'énergie aujourd'hui → manquer d'O₂ demain).
- Rester sur **3 ressources** : Énergie, Support de vie (O₂ + nourriture), Dose de radiation. Refuser toute nouvelle jauge ; transformer l'idée en effet sur ces trois-là.

## Passe 3 — Science juste, données honnêtes

### Chaque chiffre ou fait affiché a un statut

| Statut | Signification | Ce qu'on affiche |
|---|---|---|
| **Réel live** | Récupéré à l'instant depuis une API NASA | « En direct — NASA DONKI » + date de la donnée |
| **Réel archivé** | Donnée NASA réelle stockée dans le repo | « Événement réel du JJ/MM/AAAA — NASA DONKI » (jamais « en direct ») |
| **Simplifié** | Ordre de grandeur réel, arrondi ou mis à l'échelle pour le jeu | Rien de spécial en jeu, mais **ligne obligatoire dans `DATA.md`** |
| **Inventé** | Paramètre de pur équilibrage | Jamais présenté comme un fait ; **ligne obligatoire dans `DATA.md`** |

Règles :
- Un fait marqué **(à vérifier)** dans `GAME_DESIGN.md` ne part pas en démo tant qu'il n'a pas de source NASA (ou agence partenaire) avec lien.
- Une donnée figée n'est **jamais** présentée comme live. Si l'API échoue et qu'on retombe sur l'archive, l'interface le dit.
- Un événement DONKI observé près de la Terre et appliqué à une base sur la Lune ou Mars est présenté comme tel : « Événement réel observé le JJ/MM/AAAA, imaginé ici frappant ta base. »
- Chaque source affichée en jeu apparaît aussi dans la page « Sources & science ».
- Clé API : jamais dans le code client commité ni dans un bundle public.

Format d'une ligne `DATA.md` :
```
| Élément du jeu | Valeur en jeu | Valeur réelle + source (lien) | Statut | Pourquoi on a simplifié |
```

### Pièges scientifiques connus
Voir `references/science-watchlist.md` avant d'écrire un texte sur la radiation, l'énergie, la Lune ou Mars. Ajouter à ce fichier toute erreur trouvée en revue.

### Données NASA : ce qu'on sait des APIs
Voir `references/data-sources.md` (limites, endpoints cassés, formats) avant de brancher ou d'archiver une donnée.

## Passe 4 — L'échec apprend

Tout état d'échec ou de mission partielle doit répondre aux quatre questions de `GAME_DESIGN.md` :

1. **Qu'est-ce qui a lâché ?** (ressource + moment)
2. **Pourquoi ?** (chaîne de causes, 2–3 étapes, avec l'événement réel daté s'il y en a un)
3. **Qu'est-ce qui aurait aidé ?** (contrefactuel **réellement simulé**, pas un conseil générique, et **réalisable** : il respecte le budget et la place de la soute, sinon il remplace un objet par un autre)
4. **Et dans la vraie vie ?** (un fait NASA sourcé)

Plus : montrer au moins **une chose qui a bien marché**, et proposer **« Retenter la même mission »**.
Refuser : « Game over » seul, un message qui blâme le joueur, un conseil impossible à tester.

## Format du rapport de revue

```
## Revue junior-mission-review — <ce qui a été revu>

### Bloquant (à corriger avant démo)
- [passe N] <fichier:ligne> — problème → correction proposée

### À améliorer
- ...

### DATA.md — lignes à ajouter
| ... |

### OK
- <ce qui respecte déjà les règles, en une ligne>
```

Proposer directement le texte réécrit plutôt que de seulement signaler le problème.
