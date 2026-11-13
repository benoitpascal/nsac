# JAM — NASA Space Apps Challenge 2026

> Plan de hackathon (format du skill `game-jam`). Les infos marquées ⚠️ viennent de résumés de recherche : **les confirmer sur le site officiel** (le guide de soumission 2026 est publié le 13/11).

## Règles

| | |
|---|---|
| Événement | NASA Space Apps Challenge 2026 — challenge « Build a Junior Astronaut Mission Trainer » |
| Fenêtre | **Samedi 14/11 09:00 → dimanche 15/11 23:59, heure locale** ⚠️ (fuseau à confirmer) |
| Dépôt | Page projet sur spaceappschallenge.org, **en anglais** |
| Démo | **Vidéo de 30 s max** (sous-titres anglais) **ou 7 slides max** titre compris ⚠️ — hébergée ailleurs (YouTube / Drive), **lien public** |
| Données | Données ouvertes NASA / agences partenaires, **sources citées** et usage expliqué (→ `DATA.md`) |
| Code | Projet open source, code partagé ⚠️ (règle des éditions précédentes) |
| Code écrit avant le début | ⚠️ à vérifier dans le guide 2026 (notre boilerplate Vite existe déjà) |
| Règle IA | ⚠️ à vérifier dans le guide 2026 |
| Jugement | À partir du 16/11 ; nominés en décembre, gagnants globaux en janvier 2027 |

Liens : https://www.spaceappschallenge.org/2026/ · https://www.spaceappschallenge.org/resources/project-submission-guide/ · https://www.spaceappschallenge.org/resources/participant-faqs/ · https://www.spaceappschallenge.org/resources/judging-awards-guide

## Concept (une phrase)

**You pack the cargo hold of a Mars mission to keep your crew alive and do science while real solar storms from NASA's archives hit your base.**

## MVP

1. Moteur de simulation déterministe dans `core/` (3 ressources + journal causal), testable sans interface.
2. Grille de soute en DOM, mission fixe sur Mars, 7 objets, 4 fusions.
3. Résolution automatique sur une vraie séquence DONKI archivée.
4. Débrief : ce qui a lâché, pourquoi, ce qui aurait aidé (contrefactuel simulé), et dans la vraie vie.
5. « Retenter la même mission ».
6. Page « Sources & science » + `DATA.md`.

## Stretch (dans l'ordre où on les coupe en premier → en dernier)

1. Boutique aléatoire
2. Destination Lune
3. Trois niveaux de difficulté (garder au moins deux périodes solaires)
4. Carnet de découvertes
5. Décor Three.js
6. Mission « Le Soleil cette semaine » (données récentes pré-récupérées)
7. Graine partageable par URL (classe)

## Planning (~39 h, à ajuster au fuseau confirmé)

| Créneau | Objectif |
|---|---|
| Sam 09:00–10:00 | Trancher les « Propositions de revue » de `GAME_DESIGN.md`, se répartir les rôles, script d'archive DONKI/InSight |
| Sam 10:00–14:00 | Moteur `core/` + données archivées en JSON. **Boucle jouable en primitives à 14:00** |
| Sam 14:00–20:00 | Grille DOM + résolution + débrief v1. Premier test avec un enfant / un proche si possible |
| Sam 20:00 | ✅ Point de contrôle : revue `junior-mission-review` complète, couper si la boucle n'est pas fun |
| Nuit | Dormir |
| Dim 09:00–15:00 | Contrefactuel, « Retenter », page Sources, textes et faits sourcés, seconde période solaire |
| Dim 15:00 | 🧊 **Gel des fonctionnalités** : seulement crashs et blocages |
| Dim 15:00–19:00 | Habillage, game feel, tournage de la vidéo de 30 s ou des 7 slides, page projet en anglais |
| Dim 19:00 | ✅ Revue `junior-mission-review` avant démo |
| Dim 21:00 | **Soumettre** (marge de 3 h), puis vérifier que le projet apparaît bien |

## Rôles (à remplir)

| Personne | Rôle |
|---|---|
| | Moteur de simulation (`core/`) |
| | Interface DOM / grille / débrief (`ui/`) |
| | Données NASA (archive, `infra/`, `DATA.md`) + textes enfant |
| | Démo : vidéo / slides / page projet |

## Journal des coupes

| Heure | Coupé | Pourquoi |
|---|---|---|
