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
| Mars has no global magnetic field and its thin air gives only minimal protection. | https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/ |

### Notes for writers
- Gray (absorbed dose) and sievert (dose equivalent) are different units: never convert silently.
- NASA uses two different chest X-ray comparisons across pages: keep the one attributed above.
