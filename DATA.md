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

| Game element | In-game value | Real value + source | Status | Why simplified |
|---|---|---|---|---|
| Mission time scale | _TBD_ | Real events span days to months | Simplified | Real DONKI dates are compressed into a few minutes of play |
| Regolith printer power and build time | _TBD_ | No NASA figure published (MMPACT) | Invented | Balancing only |
| Dosimeter auto-shelter | Crew shelters as soon as dose rate rises | NASA gives no warning lead time | Simplified | Models SRAG advice as an instant reaction |
| _TBD_ | | | | |

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
