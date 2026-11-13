# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check and build static files into dist/
pnpm preview      # Serve the production build locally
pnpm lint         # Run ESLint on src/
pnpm type-check   # Run tsc --noEmit
pnpm format       # Run Prettier on src/
```

## Stack

- **HTML + TypeScript** (strict mode), no UI framework
- **Vite** as dev server and bundler
- **ESLint** (typescript-eslint) + **Prettier**
- **pnpm** as the package manager
- Production image: static files from `dist/` served by nginx

## Project profile

- README profile: application end-user (B.1)
- RELEASES profile: utilisateur final non-tech (B.1)

## Architecture

Entry point: `index.html` loads `src/main.ts` and `src/styles.css`.

### Layers

Business code lives in `src/modules/<feature>/`:

- `ui/`: DOM rendering and event wiring. Imports `core/`, never `infra/`.
- `core/`: types, state and game logic. Never imports `ui/`.
- `infra/`: external calls (HTTP, storage, files). Imports only types of `core/` (`import type`), never `ui/`.

`@typescript-eslint/no-restricted-imports` in `eslint.config.mjs` enforces these rules.

Shared utilities live in `src/shared/`.

### Simulation et rendu

Le moteur de simulation (ressources, événements, journal causal, contrefactuel du débrief) vit dans `core/` : **déterministe** (graine fixée), sans dépendance au DOM ni à Three.js, testable seul. Les données NASA sont lues par `infra/` depuis des JSON **pré-récupérés et commités** : le site est servi en statique par nginx, donc aucune clé API ne doit se retrouver dans le bundle.

## Projet : NASA Space Apps Challenge 2026

On participe au **NASA Space Apps Challenge 2026**, challenge **« Build a Junior Astronaut Mission Trainer »** (énoncé complet dans `README.md`).

On construit un **jeu / app éducative, jouable dans le navigateur**, où des **enfants de 7 à 12 ans** gèrent un **avant-poste lunaire ou martien**. Le cœur du jeu : des **arbitrages d'ingénierie réels** (énergie, support de vie, blindage anti-radiation, nourriture, délai de communication) où **aucun choix n'est gratuit**, nourris par des **données ouvertes NASA réelles**.

C'est un **hackathon** : on vise un prototype qui marche et qui se démontre bien devant un jury, pas un produit industriel. Privilégier ce qui est jouable vite.

## Règles de conception (issues de l'énoncé — à respecter)

1. **Chaque décision est un trade-off.** Jamais d'option « safe » sans coût. Si on ajoute un choix, on doit pouvoir dire ce qu'il coûte.
2. **La mécanique avant le visuel.** Un jeu simple qui enseigne une vraie contrainte > un beau jeu qui n'enseigne rien.
3. **2–3 ressources centrales max** (ex. support de vie, énergie, blindage). Ne pas empiler 5–6 jauges.
4. **Effets différés / cumulés** : un choix qui économise de l'énergie aujourd'hui peut coûter de l'oxygène demain.
5. **Langage simple** pour 7–12 ans. Tout terme technique inévitable (dose de radiation, microgravité, sol…) est expliqué en contexte, en une phrase.
6. **Zéro friction** : navigateur, pas d'installation, pas de compte.
7. **Rejouabilité** : événements variables d'une partie à l'autre ; l'échec doit être instructif, pas punitif.
8. **Lien jeu ↔ réel** : montrer au joueur la donnée réelle derrière un événement (ex. « cette tempête solaire est basée sur l'éruption X du JJ/MM/AAAA »).

## Skill projet `junior-mission-review`

À utiliser **systématiquement** dès qu'on écrit un texte affiché au joueur, qu'on ajoute un objet, une fusion, une mécanique ou un chiffre scientifique, qu'on branche une donnée NASA, et avant chaque démo. Il contient aussi les constats vérifiés sur les APIs NASA (`references/data-sources.md`), les pièges scientifiques (`references/science-watchlist.md`) et le glossaire enfant FR/EN (`references/glossary.md`). Toute simplification ou valeur inventée va dans `DATA.md`.

## Données : règles d'honnêteté

- Utiliser des **données NASA réelles** plutôt que des chiffres inventés, partout où c'est possible.
- **Attribuer chaque source dans l'interface** (nom du dataset + lien).
- Si on utilise un jeu de données figé/embarqué, **ne jamais le présenter comme live**. Distinguer clairement « données live » vs « données archivées ».
- Quand un paramètre de gameplay est simplifié ou inventé pour l'équilibrage, le documenter (ex. dans un `DATA.md`) pour que le jury puisse tracer ce qui est réel et ce qui ne l'est pas.
- Clé API NASA : via variable d'environnement / config, **jamais commitée**. `DEMO_KEY` en fallback (rate limit bas).

## Sources de données disponibles

| Source | Usage envisagé |
|---|---|
| NASA Open APIs — https://api.nasa.gov/ | Portail central (DONKI, InSight, Trek WMTS, OSDR). Mars Rover Photos retirée du catalogue ; ancienne API APOD coupée le 1er décembre 2026 |
| InSight (`/insight_weather/`) | Météo martienne réelle, figée sur les sols 675–681 (2020) → nuits froides, énergie |
| DONKI — https://kauai.ccmc.gsfc.nasa.gov/DONKI/ | Éruptions solaires, CME, SEP → événements radiation / coupures comms |
| OSDR — https://osdr.nasa.gov/ | Études santé astronautes (os, muscles, immunité, sommeil) → « le saviez-vous » / conséquences santé |
| RadLab (OSDR) | Doses de radiation mesurées sur l'ISS → calibrer le modèle de dose |
| Mars Trek — https://trek.nasa.gov/mars/ | Terrain, imagerie, élévation → choix / visuel du site |
| CSA (Agence spatiale canadienne) | Ressources STEM jeunesse ; kit « production alimentaire sur la Lune » → mécanique serre/nourriture |

_URLs à vérifier lors de l'intégration (endpoints exacts, CORS, quotas)._

## État du projet

- [x] Sujet choisi, README initial
- [x] Skills Claude Code installés dans `.claude/skills/` (Three.js, game design, tests web). Voir `.claude/skills/THIRD_PARTY.md`
- [ ] Concept de jeu : **en cours**, voir `GAME_DESIGN.md` (préparation → voyage → planète, soute en grille, fusions, météo DONKI réelle, débrief d'échec ; questions ouvertes en fin de doc)
- [x] Stack et déploiement : Vite + TypeScript, servi en statique par nginx (Docker), CI/CD GitHub Actions. **Un push sur `main` déploie en prod, sur `dev` en staging** : travailler sur des branches.
- [ ] Rendu : DOM pour la grille et l'interface ; Three.js en option pour le décor (à trancher)
- [ ] Intégration des données (live et/ou dataset embarqué)
- [ ] Prototype jouable
- [ ] Page « Sources & science » pour le jury
- [ ] Démo / pitch

Plan du hackathon, règles de soumission et planning : `JAM.md`. Faits scientifiques vérifiés et sources : `DATA.md`.

Mettre à jour cette checklist et la section « Our solution » du README au fil des décisions.

## Conventions

- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`…).
- Ne jamais pousser directement sur `main` ou `dev` sans l'accord de l'équipe : ces deux branches déclenchent un déploiement.
- README en anglais (jury international) ; échanges et notes internes en français OK.
