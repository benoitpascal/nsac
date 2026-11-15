# DATA — what is real, what is simplified

This page lets judges trace every number in the game back to its source. Each row says whether the value is **real (live)**, **real (archived)**, **simplified** (a real order of magnitude, rounded or scaled for play) or **invented** (pure game balancing).

## NASA datasets used

| Dataset | What we use it for | Live or archived | Link |
|---|---|---|---|
| DONKI (CME, SEP, notifications) | Real space-weather events that hit the player's base | Archived (pre-fetched JSON, fetch date shown in game) | https://api.nasa.gov/ · https://kauai.ccmc.gsfc.nasa.gov/DONKI/ |
| InSight Mars Weather | Real Martian night temperatures → heating / power | Archived (sols 675–681, 2020; mission ended Dec 2022) | https://api.nasa.gov/ (InSight: Mars Weather Service API) |
| Mars Trek WMTS | Real terrain of the landing site | Live tiles | https://trek.nasa.gov/mars/ |
| OSDR | Hand-written health cards, each linked to its OSD study | Archived (curated) | https://osdr.nasa.gov/ |
| RadLab (OSDR) | ISS background dose reference | Archived (values read by hand, date noted) | https://visualization.osdr.nasa.gov/radlab/ |
| CSA — Food production on the Moon | Greenhouse mechanic | Reference | https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/ |

## Game values

### Scenario (game choices, not measured values)

- Base gauges start at air 100 %, power 85 %, water 60 %.
- Bag (for missions where the astronaut goes outside): 4 slots (one tool, at least one oxygen bottle, up to 4 bottles and 3 spare robot batteries). A fully used bottle costs 3 air points; each robot charge of 0.03 kWh used costs 4 power points; every 10 kg of regolith delivered brings 1 water point (ice in the regolith).
- Drums: standard 1 kg/s at 0.9 kW, wide 1.6 kg/s at 1.4 kW.
- Excavator mission: driven by remote control from inside the base, so no bag and no suit air; goal 50 kg; each robot charge of 0.03 kWh used costs 4 power points; efficient at 3 power points or below.
- Printer calibration (laser mirrors mini-game): 2 power points plus 0.1 per missing score point; efficient from a score of 70. The score sets the printer quality: optimal (≥ 70), partial (≥ 40), failed (below), as in the validated scenario.
- Printing bricks at the end of day one (player's choice): 20 power points; 1 brick per 10 kg of regolith, times 100 % / 60 % / 30 % for an optimal / partial / failed calibration; the rest of the regolith is wasted. Keeping the regolith costs nothing but gives no bricks.
- Night: 5 points of air, power and water every night.
- Suit: oxygen drains 0.28 %/s at rest with one bottle (×1.6 walking, ×2.6 running, ×2 busy, +10 % per extra item, divided by the number of bottles); battery 0.12 %/s × effort; both refill 8 %/s inside. Rescue at 9 %, costing 4 hours.
- Day screens use the base's local-time model (`planet-walk/core/station/local-time.ts`, NASA fact-sheet extremes +120 °C / −170 °C): day one is the date the game started, day N is N − 1 days later.


| Game element | In-game value | Real value + source | Status | Why simplified |
|---|---|---|---|---|
| Mission time scale | _TBD_ | Real events span days to months | Simplified | Real DONKI dates are compressed into a few minutes of play |
| Regolith printer power and build time | _TBD_ | No NASA figure published (MMPACT) | Invented | Balancing only |
| Dosimeter auto-shelter | Crew shelters as soon as dose rate rises | NASA gives no warning lead time | Simplified | Models SRAG advice as an instant reaction |
| Day 1 regolith target | 50 kg delivered by the excavator robot, one battery charge (30 % of 0.1 kWh), no recharge during the day | No NASA mission sets a daily target; the robot's figures are rounded from RASSOR (`excavator-power.ts`); its drums dig 2.5 kg/s at 2.25 kW and unload 10 kg/s, sped up 2.5 times for play with the power scaled so each kilogram costs the same energy | Invented | Gives day one a clear goal; the battery leaves room for one 50 kg trip plus some mistakes, not for wandering; testers found 50 s of digging too long |
| Moon act length | 5 demo days out of a 30-day campaign | No crewed Moon stay has lasted more than about 75 h (Apollo 17); 30 days is a scenario hypothesis from the HORIZON design book | Invented | The design book asks for 5–7 representative days in the demo |
| Base crew needs per day | 6 people: 5 kg oxygen, 11 kg food | 0.84 kg O₂ and 1.8 kg food per person per day (same NASA life-support figures as the planet-walk station), × 6, rounded | Simplified | Rounded so children can add them up |
| Base power | Battery 200 kWh, base uses 150 kWh/day, panels make 220 kWh/day (50 kWh on the day 2 shadow) | No real base; south-pole lighting depends on relief, as the design book notes | Invented | Balancing: power is the main limit on how many astronauts can work |
| Knowledge needed for Mars | 100 points, checked when the ship leaves after day 5 | No real equivalent | Invented | A steady balanced plan wins (112), a too careful one just misses (96) |
| Fatigue | +1 per working day, −2 per rest day, exhausted at 4; no rest in the cramped storm shelter | No NASA scale | Invented | Forces rest days and rotation, and keeps the storm from being a free rest day |
| Day 4 solar storm | Based on DONKI episode EP-2017-09-10 (SEP seen by GOES and SOHO, 10 Sep 2017) | Real archived event observed near Earth; told in game as "imagined here reaching your base" | Real archived, effect simplified | Sheltering stops all work except a regolith-shielded lab; staying out sends the whole crew to rest the next day (radiation dose). No dose is computed |
| Regolith shield on the lab | ≥ 50 kg of regolith from the day one robot mission lets the lab work during the storm | Regolith shielding is a common habitat idea (NASA source still to add); no figure ties 50 kg to a safe lab | Invented | Links the robot mission to the base management |
| Moon walk: base site and day length | Sky of the Moon's south pole (Sun and Earth low on the horizon), with a 14-day day and 14-day night | Near the south pole, light depends on the relief: some rims get light almost all the time (https://science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/) | Simplified | Keeps the station dashboard's simple day/night cycle (`core/station/local-time.ts`) under the Artemis site's sky |
| Moon walk: Sun's height at noon | 10° above the horizon | About 1.5° at most at the south pole, since the Moon's axis is tilted 1.5° from the ecliptic (source link to verify) | Simplified | At 1.5° the flat ground would look almost black; 10° keeps it readable while shadows stay very long |
| Moon walk: Earth's size in the sky | 3.8° wide | About 1.9° (Earth 12,756 km wide, 384,400 km away: https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html) | Simplified | Drawn twice as wide, like a zoom lens, so that its phase and city lights are visible on screen |
| Moon walk: Earth's place in the sky | Fixed, 6° above the horizon | Fixed (the Moon always shows the Earth the same face); seen from the south pole it wobbles a few degrees around the horizon (libration) | Simplified | One fixed height chosen above the hills |
| Moon walk: Earth's phase | Computed from the same Sun direction as the ground's light: new Earth at the base's noon, full Earth at midnight | Real geometry | Real | — |
| Moon walk: stars and Milky Way | Real star positions and colors (HYG Database v4.1, CC BY-SA 4.0, archived in `public/data/stars.json`); Milky Way glow drawn along the real galactic plane | In daylight, the glare of the sunlit ground hides the stars from eyes and cameras (Apollo photos show a black sky) | Simplified | Stars kept visible in daylight for the sense of place |
| Moon walk: earthshine brightness | Bluish light on the ground at night, strongest at full Earth | Earthshine is real and much brighter on the Moon than moonlight on the Earth | Simplified | Brightness tuned by eye, not computed |
| Moon walk: craters and hills | Craters drawn on the flat ground by light and shade only; hills beyond 560 m are random | Not real lunar relief (LRO / Moon Trek terrain not used yet) | Invented | The walker's physics needs flat ground; real terrain is a possible next step |
| Moon walk: solar arrays on turning masts | 7 upright panels on 6 m masts, turning to face the Sun all lunar day | Based on NASA's Vertical Solar Array Technology (VSAT) idea for the south pole, where the Sun stays low (source link to verify) | Simplified | Size and number of masts chosen for the scene, not from a NASA design |
| Moon walk: astronaut's gait | Below 2.5 m/s² of gravity the astronaut lopes (one leg leads, long hops); above it, it runs. Its stride rate grows with the square root of gravity | Apollo crews loped and hopped on the Moon; slower strides under weaker gravity follow the pendulum-like swing of a leg (source link to verify) | Simplified | Hop height, stride rate and the 2.5 m/s² switch are tuned by eye; walking and running speeds stay the same on every world |
| Moon walk: jump wind-up and landing | The legs bend for 0.25 s before a jump leaves the ground; landing bends them deeper the faster the astronaut comes down, longer under weaker gravity | Real jumps start with a knee bend and end with one; Apollo suits limited how far the knees bent | Simplified | Timings and depths tuned by eye; take-off speed (3 m/s) unchanged, so jump height and time in the air stay the same |
| Moon walk: crew lander | Two-stage lander: gold-foil descent stage on four legs, faceted silver cabin on top | Look taken from the game's intro video, close to Apollo's Lunar Module; NASA's real Artemis III lander is SpaceX's Starship HLS, a tall steel ship (source link to verify) | Simplified | Shapes and sizes drawn by eye to match the intro, not a model of a real lander |
| Moon walk: astronaut's suit | Apollo-style suit: dusty cloth, gold sun visor, dark gloves, chest control unit, tall backpack | Look taken from the game's intro video, close to the Apollo A7L suit | Simplified | Drawn from simple shapes, not a model of a real suit |
| Moon walk: HUD compass | Heading tape N, NE, E… with « north » = the way the astronaut faces at the start | The Moon has no global magnetic field, so a magnetic compass would not work there; at the south pole almost every way is « north » | Invented | Game convention so the kids can talk about directions; not the Moon's true north |
| Base terminal: main mission progress | Share of the act's missions already played (each mission counts the same: 0 %, 33 %, 67 %, 100 %) | Not a real measure | Invented | Shows the kids how far they are in the act; the mock-up's 10 % was a placeholder |
| Moon walk: HUD energy and O₂ | Energy ring = suit battery, O₂ bar = suit oxygen (the mock-up's water and food bars are left out: the suit does not model them) | Real suits track oxygen and battery among other consumables | Simplified | Keeps the HUD to the resources the game simulates |
| Greenhouse mission (day 2) | Planning pays 40 water (the base starts day two with 60, so even a very rough job leaves some) and 10 power points; laying the pipes well gives 20 food points; a rough job leaks 8 water points, a very rough one 15 and waters only half the seeds (10 food) | No NASA figure ties pipe laying to water lost or food grown; real space gardens (Veggie) give a little fresh food, not a crew's meals | Invented | Turns the greenhouse action into a mission with a trade-off: fewer pipe turns, less water lost |
| Glass greenhouse dome outside the base | Lets sunlight in and keeps seeds warm; reached on foot, using suit oxygen | NASA studies lunar greenhouses (e.g. Veggie, lunar food production kits from the CSA); a glass dome on the surface is a game picture, real designs would need radiation shielding | Simplified | Gives the player a reason to go outside |
| _TBD_ | | | | |

## Mascot voice (synthetic)

The mascot's spoken lines are a synthetic voice (ElevenLabs, voice « Liam », model `eleven_multilingual_v2`), recorded once from the same English texts the player reads with `pnpm voices` and shipped as MP3 files in `public/voices/`. It is not a recording of a real person or of NASA staff. Lines that contain the player's own amounts (regolith kg, bricks, power used) are not recorded and stay text only. The player can turn the sound off.

## Photos

| Photo | Where | Source |
|---|---|---|
| RASSOR 2.0 digging robot in a regolith test bin, Kennedy Space Center, 29 Sep 2016 (NASA / Dimitri Gerondidakis, public domain), resized to `public/arcadia/robots/rassor-nasa.webp` | Mascot pages that introduce the robot, and the robot panel of the outdoor HUD | https://images.nasa.gov/details/KSC-20160929-PH_DNG01_0001 |

The game's robot is a simplified 3D model inspired by RASSOR, not a copy of it.

## Facts shown to players (verified 2026-11-13)

| Fact (as shown, EN) | Source |
|---|---|
| The Sun has a cycle of about 11 years. NASA and NOAA announced in October 2024 that the Sun had reached solar maximum. | https://svs.gsfc.nasa.gov/14683/ · https://www.spaceweather.gov/news/joint-solar-maximum-announcement-nasa-and-noaa |
| On Mars, sunlight is about 43% as strong as on Earth (586 vs 1,361 W/m²). | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html |
| A night on the Moon lasts about 14 Earth days. Near the south pole, some peaks get light almost all the time. | https://www.nasa.gov/reference/moonbase-environment/ · https://science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/ |
| A message takes about 1.3 s to reach the Moon and 4 to 24 minutes to reach Mars. | https://www.nasa.gov/missions/tech-demonstration/space-communications-7-things-you-need-to-know/ |
| Going to the Moon takes about 3 days; going to Mars takes about 7 to 10 months. | https://www.nasa.gov/directorates/smd/how-long-does-it-take-to-get-to-the-moon-mars-jupiter-we-asked-a-nasa-expert-episode-51/ |
| The space station recycles 98% of its water, including sweat and urine. | https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/ |
| The station makes oxygen by splitting water with electricity. | https://www.nasa.gov/wp-content/uploads/2015/03/104840main_eclss.pdf |
| If astronauts had stood next to Curiosity during the May 2024 solar storm, they would have received 8,100 micrograys — like 30 chest X-rays. | https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/ |
| On the way to Mars you get about 1.8 mSv of radiation per day; on the Martian surface about 0.67 mSv per day. | https://www.jpl.nasa.gov/news/data-from-nasa-rovers-voyage-to-mars-aids-planning/ · https://www.nasa.gov/news-release/nasa-rover-results-include-first-age-measurement-on-mars-and-help-for-human-exploration/ |
| On the ISS, astronauts receive roughly 0.5 mSv per day (order of magnitude). | https://www.nasa.gov/wp-content/uploads/2023/10/lsah-newsletter-2023-vol28-issue2.pdf |
| Water and hydrogen-rich materials block radiation well. On Orion, the crew builds a storm shelter from bags of food and water. | https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/ · https://www.nasa.gov/missions/artemis/orion/scientists-and-engineers-evaluate-orion-radiation-protection-plan/ |
| MOXIE made 122 g of oxygen from Mars air — what a small dog breathes in about 10 hours. | https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ |
| In 2015, NASA astronauts ate the first lettuce they grew in space (Veggie). | https://blogs.nasa.gov/kennedy/2015/08/11/veggie-success-benefits-journey-to-mars-and-eaters-on-earth/ |
| A day on Mars (a "sol") lasts 24 h 39 min. Mars gravity is 38% of Earth's; the Moon's is about 1/6. | https://www.giss.nasa.gov/tools/mars24/help/notes.html · https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html |
| Dust covered InSight's solar panels; its power fell from about 5,000 to 500 Wh per sol and the mission ended in December 2022. | https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/ |
| NASA is developing ways to 3D-print buildings with lunar soil (MMPACT). | https://www.nasa.gov/directorates/stmd/nasa-enables-construction-technology-for-moon-and-mars-exploration/ |
| ISS iROSA solar arrays roll up "like a carpet" for launch and are nearly half the size of the old arrays. | https://www.nasa.gov/directorates/spacetech/Rolling_Out_a_Path_to_Future_Space_Travel · https://www.nasa.gov/missions/station/new-solar-arrays-to-power-nasas-international-space-station-research/ |
| Curiosity's and Perseverance's nuclear power source (MMRTG) makes about 110 W, day and night, and loses a few percent each year. | https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/power/ · https://science.nasa.gov/wp-content/uploads/2024/02/mmrtg-factsheet-updated-5-18-20-1.pdf |
| Apollo and Space Shuttle fuel cells made electricity from hydrogen and oxygen; the leftover water was used for drinking. | https://ntrs.nasa.gov/api/citations/19760005605/downloads/19760005605.pdf · https://webarchive.library.unt.edu/eot2008/20090114191754/http:/www.hq.nasa.gov/alsj/AERTND7291PotableWater.pdf |
| Apollo 13: the square CO₂ filters didn't fit the round holes, so the crew built a fix from cardboard, bags and tape. The ISS removes CO₂ with the CDRA. | https://www.nasa.gov/wp-content/uploads/static/history/SP-350/ch-13-4.html · https://www.nasa.gov/ochmo-tb-004-carbon-dioxide-2/ |
| Hydrogen-rich materials (like polyethylene) shield best, as measured on the ISS (ALTEA). | https://pmc.ncbi.nlm.nih.gov/articles/PMC3941539/ · https://ntrs.nasa.gov/api/citations/20170002287/downloads/20170002287.pdf |
| ISS crews wear active dosimeters; NASA's SRAG team watches space weather and tells astronauts when to shelter. | https://srag.jsc.nasa.gov/SpaceRadiation/How/How.cfm |
| Perseverance sends 99.9% of its science data through orbiters (MRO, MAVEN, ESA's TGO); NASA's Deep Space Network receives it. | https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/telecommunications/ |
| ISS astronauts exercise about 2 hours a day and can still lose about 1% of bone mass per month. | https://www.nasa.gov/missions/station/iss-research/astronaut-exercise · https://ntrs.nasa.gov/citations/20170004598 |
| Feeding one astronaut's oxygen with plants would take a garden about the size of a classroom (~20–25 m² of crops); a Veggie unit is ~0.15 m². | https://simoc.space/wp-content/uploads/2018/09/When-Can-Plants-Begin-to-Contribute-to-Atmospheric-Management-WHEELER.pdf |
| The ISS makes oxygen from water and keeps oxygen tanks and oxygen "candles" as backups. | https://www.nasa.gov/image-article/nors-tanks-prepared-commercial-resupply-flight-international-space-station/ · https://ntrs.nasa.gov/citations/20110012004 |
| NASA plans spacewalks around space weather and can delay or end one during a radiation event. | https://srag.jsc.nasa.gov/SpaceRadiation/How/How.cfm |
| Mars has no global magnetic field and its thin air gives only minimal protection. | https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/ |

### Notes for writers
- Gray (absorbed dose) and sievert (dose equivalent) are different units: never convert silently.
- NASA uses two different chest X-ray comparisons across pages: keep the one attributed above.
