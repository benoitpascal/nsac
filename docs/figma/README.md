# Figma export — Project Arcadia

Snapshot of the Figma file **PROJECT-ARCADIA (Copy)**, taken on 2026-11-15, so that the team can read the mock-ups without Figma access.

- Source: https://www.figma.com/design/uMfUKaVVH7PqOYmjt6liEw/PROJECT-ARCADIA--Copy- (one page, « Page 1 », 669 layers).
- The Figma file stays the source of truth: this folder is a frozen copy and does not follow later edits.
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
| `11-act-select-v2.webp` | Ecran - selection acte `48:330` | **New** act selection: three wide « Choice planet » cards linked by chevrons, « START MISSION » button. Not implemented yet. |
| `12-frame-12-wip.png` | Frame 12 `21:1074` | Screen started from the « Information » reference (small logotype, grey placeholder panel). |
| `13-terminal-a.webp`, `14-terminal-b.webp` | Frame 15 `48:289`, Frame 16 `48:297` | **New** base terminal: a screen in the lunar module showing a rover picture and three cyan dots; click zooms into the screen. Not implemented yet. |

## Components

| File | Component | Variants / props |
|---|---|---|
| `btn.png` | BTN `7:263` | Default (label 60 % opacity) and hover « Variante2 » (thicker stroke, extra glow). Props: icon, label. |
| `logotype.png` | Logotype `7:231` | Light (white + blue glow) and White. |
| `logotype-flat.png`, `logotype-text-draft.png` | Logotype `7:124`, `4:62` | Earlier logotype versions. |
| `mission-card-demo.png` | Mission card DEMO `13:737` | Default and hover. Props: Act, Destination. |
| `mission-card-locked.png` | Mission card Locked `13:752` | Default and hover (darker picture, lock icon). |
| `status-act.png` | Status Act `13:537` | Actif (green « DEMO ») and Locked (red « Locked »). |
| `choice-planet.webp` | Choice planet `50:376` | Default and hover (glow, thicker cyan gradient stroke). Props: Act, Planet, Description. |
| `status-card.png` | Card `13:416` | Props: Valeur, Type, icon (grey placeholder `Icons neutre`). |
| `icon-chevrons.png` | Icons - chevrons - start `43:273` | Double cyan chevron. |

## Design tokens (Figma variables)

| Variable | Value |
|---|---|
| Primary color 1001 | `#0b0f1c` |
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

Styles: paint « White » `#f7f5f5`, paint « Dégradé » linear `#35e9fd → #208b97`, text « Texte UI BTN » (Bebas Neue Bold 32 px, letter-spacing 16 %), effects « Effet BTN » (glass blur 4 + white glow 25 %) and « Effet cards » (glass blur 13 + white glow 25 %).

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
| `rectangle-13-video.png` | Frame of a video placed on the canvas (video fills cannot be exported). |

Not copied here: two screenshots of a commercial video game interface (`image 6` `21:1039`, `image 7` `21:1042`) used as mood references, which cannot be redistributed; open them in Figma.

## Known gaps of the mock-ups

- Videos (home background, Day One background) are video fills: Figma only exports their first frame.
- Status card icons are grey placeholders (`Icons neutre`).
- Day One shows « -150 °C » together with « daylight »: on the Moon, about -150 °C is a night value (to check with the science review).
- « start playin » on the home button is a typo in the instances (component label is « COMMENCER »).
- « Choice planet » cards all say « Moon Mission Preparation » and show the Earth picture: the description and picture are not set per act yet.
