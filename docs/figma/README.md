# Figma export — Project Arcadia

Snapshot of the Figma file **PROJECT-ARCADIA**, taken on 2026-11-15, so that the team can read the mock-ups without Figma access.

- Source: https://www.figma.com/design/73mhzljKb1i3CP1xLLsnA9/PROJECT-ARCADIA (« Page 1 », 990 layers, exported here; a second page « Component » holds the planet pictures and Icon-direction).
- The Figma file stays the source of truth: the `chore/figma-sync` branch refreshes this folder from it.
- Node ids (`13:547`…) are Figma ids: append `?node-id=13-547` to the file URL to open a layer.

## Content

| File | What it holds |
|---|---|
| `screens/` | Render of every screen frame (1920 × 1080). |
| `components/` | Render of every component with all its variants. |
| `references/` | Reference pictures placed on the canvas (UI inspirations, planets, palette). |
| `layers.txt` | Every layer of the file: name, type, id, position, size, fill, text, component props, prototype links. |
| `styles.txt` | Typography of every text, strokes / radius / effects / auto-layout of components and key frames, prototype flow. |
| `tokens.json` | Figma variables (colors), paint, text and effect styles, and for each instance the component it comes from. |

## Screens

| File | Figma frame | Role |
|---|---|---|
| `01-home.webp` | Page accueil `1:8` | Home: video background, logotype, « Start playing » and « Options » buttons, divider. Implemented in `index.html`. |
| `02-home-static.webp` | Page accueil `21:998` | Same home with the still background image. |
| `03-home-background-only.webp` | Page accueil `13:962` | Background and astronaut only (logo and buttons hidden). |
| `04-act-select-intro.webp` | Slide 16:9 - 3 `1:104` | Start state of the act selection animation (cards hidden). |
| `05-act-select.webp` | Slide 16:9 - 4 `13:547` | Act selection: Act 1 Earth (locked), Act 2 Moon (demo), Act 3 Mars (locked). Implemented in `missions.html`. |
| `06-act-select-outro.png` | Slide 16:9 - 5 `13:882` | Fade to black after choosing the Moon. |
| `07-day-one-1.webp` → `09-day-one-3.webp` | Day One 1 / 2 / 3 `13:386` `13:394` `13:378` | « DAY ONE » title animation, then three status cards (temperature, solar status, crew). Implemented in `day-one.html`. |
| `10-day-one-draft.webp` | Slide 16:9 - 1 `1:2` | Older Day One draft. |
| `11-act-select-v2.webp` | Ecran - selection acte `63:1075` | Act selection, Earth card hovered: « Objectif » block (placeholder text), « Choose the act you want to play », three wide planet cards linked by chevrons (Earth and Mars locked, Moon playable), BACK and START MISSION buttons, planet picture in the header, the hovered planet faded in the background. Variant of the component set `63:1074`; an instance `63:1316` sits on the canvas. Implemented in `missions.html`. |
| `15-act-select-v3.webp` | Ecran - selection acte `63:1463` | Same screen with the Moon card selected (cyan filter), the Moon in the header and background, START MISSION in its hover state. |
| `12-frame-12-wip.png` | Frame 12 `21:1074` | Screen started from the « Information » reference (small logotype, grey placeholder panel). |
| `13-terminal-a.webp` | Ecran ordi `48:289` | Lunar module control terminal picture, alone (the rover picture, cyan dots and zoomed frame were removed). Not implemented yet. |
| `16-dashboard.webp` | Ecran - Dashboard `79:700` | **New** station dashboard draft: dark blue gradient, two soft violet glows, the mascot robot on the left, the « Ecran - Bandeau » header on top, « /// STATION DASHBOARD » title, « JOUR 01 » / « 08:28 AM » labels and the « Main Mission Progress » bar. Content panels not drawn yet. |

## Components

| File | Component | Variants / props |
|---|---|---|
| `btn.png` | BTN `7:263` | Default (label 60 % opacity) and hover « Variante2 » (thicker stroke, extra glow). Props: icon, label. |
| `logotype.png` | Logotype `7:231` | Light (white + blue glow) and White. |
| `logotype-flat.png`, `logotype-text-draft.png` | Logotype `7:124`, `4:62` | Earlier logotype versions. |
| `mission-card-demo.png` | Mission card DEMO `13:737` | Default and hover. Props: Act, Destination. |
| `mission-card-locked.png` | Mission card Locked `13:752` | Default and hover (darker picture, lock icon). |
| `status-act.png` | Status Act `13:537` | Actif (green « DEMO ») and Locked (red « Locked »). |
| `choice-planet-lock.webp` | Choice planet lock `50:376` | Locked act card: default (lock hidden) and hover (darker, lock shown). Props: Act, Planet, Description, lock icon, « Afficher Lock ». |
| `choice-planet-demo.webp` | Choice planet DEMO `63:587` | Playable act card: default, hover (cyan « DEMO » status), selected « Variante3 » (cyan filter, set on click). |
| `lock.png` | Lock `63:613` | Three cyan padlock drawings. |
| `btn-start-mission.png` | BTN `50:519` | « START MISSION » cut-corner button, default and hover (effect style « Hover BTN »). |
| `planet-header.webp` | Planet `63:886` (page « Component ») | Planet picture of the screen header: Earth, Moon, Mars (the Moon and Mars variants still show the Earth picture). Planet pictures are components Earth `63:903`, Moon `63:904`, Mars `63:905`. |
| `status-card.png` | Card `13:416` | Props: Valeur, Type, icon (grey placeholder `Icons neutre`). |
| `icon-chevrons.png` | Icons - chevrons - start `43:273` | Double cyan chevron. |
| `header-band.webp` | Ecran - Bandeau `79:707` | **New** header component (1919 × 140): logotype, cyan stripes, dotted band, « JOUR 01 » and « 08:28 AM » Info HUD labels, Moon picture on the right, bottom line. Used by the dashboard. |
| `info-hud.png` | Info HUD `75:652` | HUD label (112 × 50): white Outfit Medium text, no background, 10 px padding. Prop: Texte (« JOUR 01 », « 08:28 AM » on the instances `75:653`, `75:655`). |
| `icon-direction.png` | Icon-direction `63:1923` | Small red-orange arrow (`#f24822`), placed on a grey circle `63:1920` (compass draft). Also on the « Component » page `63:1931`. |
| `progress-bar.png` | Frame 26 `63:1911` (frame inside the dashboard, not a component) | « Main Mission Progress » bar: label and « 10% », fill `#35e9fd` on track `#212f56`. Smaller French copy Frame 25 `63:1910` (« Avancée de la mission principale », `#41acf5` on `#0e1934`). |
| `dash.png` | dash `79:755` | Three slanted cyan stripes (`#35e9fd`), the « /// » mark before screen titles. |

## Design tokens (Figma variables)

| Variable | Value |
|---|---|
| Primary color 1000 | `#0b0f1c` |
| Primary color 800 | `#141c33` |
| primary 1000 - 60% | `#141c33` at 60 % |
| Primary color 600 | `#33325e` |
| Primary color 400 | `#5973cd` |
| Secondary color 600 | `#35e9fd` |
| White | `#f7f5f5` |
| statue/Success | `#7de8b9` |
| statue/Alert | `#f9cd5f` |
| statue/Danger | `#ed5f79` |
| statue/Search | `#b596fa` |

Styles: paint « White » `#f7f5f5`, paint « Dégradé » linear `#35e9fd → #208b97`, text « Texte UI BTN » (Bebas Neue Bold 32 px, letter-spacing 16 %), effects « Effet BTN » (glass blur 4 + white glow 25 %), « Effet cards » (glass blur 13 + white glow 25 %) and « Hover BTN » (cyan glows `#35e9fd` 30 % blur 13.4 + `#b6f7fe` 60 % blur 20).

String variables: « Titre » = `Bebas neue`, « Body » = `Outfit`.

Fonts: titles **Bebas Neue**, body **Outfit**. Michroma, Orbitron and Oxanium only appear in logotype explorations.

## References

| File | Content |
|---|---|
| `image-10-briefing.webp` | In-game HUD reference (French, « Projet Artemis »): daily goal list, energy gauge, O₂ / water / food bars, compass, mini-map. Base of `briefing.html`. |
| `image-3.webp` | Earlier home screen reference (« Projet Artemis », Commencer / Options). |
| `image-16.webp`, `image-17.webp` | Control hints panel: « O » open the airlock, « → » move right, « E » use the terminal. |
| `image-11.webp`, `image-13.webp` | Mars and Moon pictures (also used for the « Choice planet » header). |
| `image-8.webp` | Photo of a lunar rover prototype in a test bed (shown in the terminal screen). |
| `nova-club.png` | « Nova Club » palette proposal: night blues and violets, cyan for actions, brighter status colors. |
| `image-4-astronaut.webp` | Astronaut standing on the left of the home screen (hidden in the final home). |
| `generated-1.webp` … `generated-5.webp`, `giant-leap-on-the-moon.webp`, `astronaut-facing-earth.webp` | Generated stills for the Moon cutscenes: astronaut walking with the Earth in the sky, astronaut facing the camera, boot stepping onto the Moon, empty lunar ground. Some show a NASA logo and a US flag. |

Not copied here: two screenshots of a commercial video game interface (`image 6` `21:1039`, `image 7` `21:1042`) used as mood references, which cannot be redistributed; open them in Figma.

## Known gaps of the mock-ups

- Videos (home background, Day One background) are video fills: Figma only exports their first frame.
- Status card icons are grey placeholders (`Icons neutre`).
- Day One shows « -150 °C » together with « daylight »: on the Moon, about -150 °C is a night value (to check with the science review).
- « start playin » on the home button is a typo in the instances (component label is « COMMENCER »).
- Act selection cards all say « Moon Mission Preparation », the Moon card still reads « ACT 1 · EARTH », and the « Objectif » text is placeholder lorem ipsum.
- The canvas also holds screenshots of the game's station dashboard (`image 21` `66:437`, `image 22` `66:626`, `image 23` `66:1017`, `image 25` `66:1245`, `image 26` `66:1248`: bag, day and fact screens with the mascot) and the game's own assets (mascot, bubble frame, cutscene videos), not copied here since they already live in `public/`.
