# Données NASA : ce qu'on a vérifié

Constats faits le 2026-11-13 avec une clé API enregistrée, sur le catalogue officiel (`https://api.nasa.gov/assets/json/apis.json`, la page api.nasa.gov étant rendue en JavaScript). À revérifier si un comportement change.

## api.nasa.gov — général

- Clé enregistrée : quota de 2 500 requêtes/heure (`x-ratelimit-limit`). `DEMO_KEY` : très limitée.
- La clé est dans `.env` (`NASA_API_KEY`), ignoré par git. Ne jamais l'envoyer dans un bundle navigateur public : proxy ou données pré-récupérées.

## DONKI (`https://api.nasa.gov/DONKI/<type>?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=...`)

| Endpoint | État constaté | Notes |
|---|---|---|
| `CME` | ✅ | 166 CME sur 54 jours. Champs : `activityID`, `startTime`, `cmeAnalyses` (vitesse, angle), `linkedEvents` |
| `CMEAnalysis` | documenté | Filtres `speed` (borne basse), `halfAngle`, `mostAccurateOnly`, `catalog`. Utile pour la difficulté |
| `SEP` | ✅ | **0 événement** sur sept.–nov. 2026 : il faut une archive pour garantir des événements radiation |
| `GST` | ✅ | `allKpIndex[].kpIndex`. Concerne la Terre (voir science-watchlist) |
| `IPS` | ✅ | |
| `FLR` | ❌ **404**, même sur des dates de 2024 | Documenté mais cassé. Contournement : `linkedEvents` des CME, ou `notifications?type=FLR` |
| `HSS`, `MPC`, `RBE` | ✅ | Peu utiles pour nous |
| `WSAEnlilSimulations` | documenté | Simulations de propagation des CME (défaut : 7 jours) ; à explorer pour l'arrivée sur Mars |
| `notifications` | ✅ | Bulletins texte. Types : all, FLR, SEP, CME, IPS, MPC, GST, RBE, report |

**Limites de dates** : la doc indique 30 jours par défaut. Constaté : erreur `Date range cannot exceed 60 days` au-delà de 60 jours. Pour `notifications`, la doc dit **30 jours max, tronqué silencieusement**. → Découper les archives en tranches de **30 jours**.

Serveur source `kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/...` : n'a pas répondu (timeout) le 2026-11-13. Utiliser le proxy api.nasa.gov.

## InSight — `https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=...`

- ✅ Répond, mais **figé** sur les sols 675–681 (2020). Mission terminée. Doc NASA : « significant missing data due to InSight needing to manage power use ».
- Température, pression, vent par sol. À présenter comme **mesures archivées de 2020**.

## Vesta/Moon/Mars Trek WMTS

- ✅ Ex. `https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml`
- URL des tuiles : `{endpoint}/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png|jpg` (lire le GetCapabilities). Moon Trek disponible aussi.

## OSDR — `https://osdr.nasa.gov/osdr/data/search?term=...&type=cgene&size=...`

- ✅ Recherche plein texte. Ex. « bone loss » → 36 études (OSD-342, OSD-18, OSD-417…). 25 résultats max par page sur l'API fichiers.
- Titres très techniques, surtout des études sur rongeurs et cellules → **rédiger à la main** des cartes enfant, chacune liée à son `OSD-xxx`.

## RadLab — `https://visualization.osdr.nasa.gov/radlab/`

- ✅ Interface web (redirige vers `/radlab/gui/overview/`). `/radlab/api/` → 500. Pas dans le catalogue api.nasa.gov.
- Relever à la main quelques débits de dose ISS, avec date et instrument.

## Retirés / à éviter

- **Mars Rover Photos** : retirée du catalogue api.nasa.gov, 404.
- **APOD legacy** : migrée vers `https://science.nasa.gov/wp-json/wp/v2/apod-basic`, ancienne API coupée le 1er décembre 2026.

## Partenaires

- **CSA** : « Space resources for STEM and youth organizations » et « Food production on the Moon and in remote areas » (contenu qualitatif, bilingue).
  - https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp
  - https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
