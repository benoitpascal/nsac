# JAM — NASA Space Apps Challenge 2026

> Plan de hackathon (format du skill `game-jam`). Règles confirmées par le Project Submission Guide 2026 (publié le 13/11).

## Règles

| | |
|---|---|
| Événement | NASA Space Apps Challenge 2026 — challenge « Build a Junior Astronaut Mission Trainer » |
| Fenêtre | **Samedi 14/11 09:00 → dimanche 15/11 23:59, heure de notre Local Event** (Universal Event : heure locale du Team Owner). Tout ce qui est enregistré après 23:59 n'est pas jugé |
| Page projet | Onglet « Project » de l'équipe (apparaît samedi 09:00). **Tout en anglais.** Bouton « Save Progress » souvent ; activer le « Lock » d'édition et se coordonner : un coéquipier peut lever le verrou et écraser des changements |
| Champs obligatoires | Project Name · High-Level Project Summary · Link to Project Demo · Link to Final Project · Detailed Project Description · **Use of Super Intelligence (SI)** · NASA Data · Space Agency Partner Data and Other References |
| Démo | **Vidéo ≤ 30 s** (sous-titres anglais si on parle une autre langue) **ou ≤ 7 slides** titre et intro compris, en anglais. **Au-delà : inéligible au jugement global.** Hébergée ailleurs (YouTube, Drive, GitHub…), lien public sans connexion, testé en navigation privée |
| Contenu des slides (si slides) | Nom de l'équipe, noms des membres, challenge choisi, image du projet, expérience utilisateur, rôle des données NASA / agences partenaires |
| Images sur la page | JPG, PNG, GIF jusqu'à 10 Mo. Pas de vidéo ni de document en upload |
| ⛔ Mineurs | **Aucune image, vidéo, audio ni ressemblance d'une personne de moins de 18 ans** dans la démo ni dans le projet. Pour un jeu destiné aux 7–12 ans : **ne pas filmer ni photographier d'enfants qui testent**, pas de voix d'enfant, pas de photo d'enfant dans le jeu. Personnages dessinés non réalistes uniquement |
| Soumission | Cocher « Terms and Conditions » et **« Confirm All Work is Original »**, puis « Submit for Judging ». Une bannière confirme. Re-soumission possible jusqu'à la fin ; seule la dernière version est jugée |
| Équipe | Tous les membres confirmés au **même Local Event** (sinon inéligible aux prix) |
| Critères de jugement | **Impact, Creativity, Validity, Relevance, Presentation** (détail : Judging and Awards Guide) |
| Site web | Notre jeu est un nouveau site : faire la **demande de classification FortiGuard** (catégorie « Education », Company Name « N/A ») pour éviter qu'il soit bloqué chez les juges. Pas obligatoire, mais à faire dès que l'URL de prod est stable |
| Usage de l'IA | Champ « Use of Super Intelligence (SI) » à remplir honnêtement : décrire comment on a utilisé l'IA (assistant de code, revue, recherche) |
| Code écrit avant le début | Non traité par le guide. Notre boilerplate Vite et les skills sont de l'outillage, mais à mentionner dans la description pour rester transparents vis-à-vis de « Confirm All Work is Original » |
| Certificat | Téléchargeable dans le profil après soumission ; le nom vient du champ « Full Name » |

Liens : https://www.spaceappschallenge.org/2026/ · https://www.spaceappschallenge.org/resources/project-submission-guide/ · https://www.spaceappschallenge.org/resources/judging-awards-guide

### Trame de la vidéo de 30 s (recommandée par le guide)

| Temps | Contenu |
|---|---|
| 0:00 | Qui on est (noms, équipe) |
| 0:02 | Le challenge et pourquoi on l'a choisi |
| 0:05 | Titre du projet + accroche |
| 0:10 | Comment ça marche : capture du jeu, expérience du joueur, rôle des données NASA (DONKI, InSight…) |
| 0:20–0:30 | Le futur : ce que ça peut apporter (classes, familles, autres missions) |

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
| Sam 09:00–10:00 | Vérifier que tout le monde est confirmé au même Local Event. Trancher les « Propositions de revue » de `GAME_DESIGN.md`, se répartir les rôles, script d'archive DONKI/InSight |
| Sam 10:00–14:00 | Moteur `core/` + données archivées en JSON. **Boucle jouable en primitives à 14:00** |
| Sam 14:00–20:00 | Grille DOM + résolution + débrief v1. Premier test avec un enfant / un proche si possible |
| Sam 20:00 | ✅ Point de contrôle : revue `junior-mission-review` complète, couper si la boucle n'est pas fun |
| Nuit | Dormir |
| Dim 09:00–15:00 | Contrefactuel, « Retenter », page Sources, textes et faits sourcés, seconde période solaire |
| Dim 15:00 | 🧊 **Gel des fonctionnalités** : seulement crashs et blocages |
| Dim 15:00–19:00 | Habillage, game feel, vidéo de 30 s ou 7 slides (sans aucun mineur à l'image), remplir **tous** les champs de la page projet en anglais, tester les liens en navigation privée |
| Dim 19:00 | ✅ Revue `junior-mission-review` avant démo |
| Dim 21:00 | **Submit for Judging** (marge de 3 h), vérifier la bannière de confirmation |

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
