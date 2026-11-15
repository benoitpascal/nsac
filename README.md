# Junior Astronaut Mission Trainer

> NASA Space Apps Challenge 2026 — Challenge: **Build a Junior Astronaut Mission Trainer**
> Difficulty: Intermediate / Beginner-Youth · Subjects: Games, Planets & Moons, Software, Space Exploration, Sun

## The challenge

Space-themed STEM content often oversimplifies the engineering trade-offs behind a real mission, or presents them at a level too complex for a young learner. Few tools make those trade-offs both **tangible and fun**.

**Goal:** design and build an interactive game or app that lets **kids aged 7–12** run a **lunar or Martian outpost**, balancing competing demands — **life support, radiation shielding, power, food production, communication delay** — so they experience first-hand the decisions that make a mission succeed or fail.

### Why it matters

As NASA works toward a sustained presence on the Moon and onward to Mars, the hard part isn't only the hardware: it's helping the public understand what survival actually requires there. On an outpost:

- limited **power** must be split between life support, communications and science;
- **radiation** exposure must be weighed against mission objectives;
- every decision has a **resource cost that compounds over time**.

NASA mission planners navigate these trade-offs daily using real data. Educational content for kids is usually either too abstract (posters, fun facts) or too technical. This project aims to close that gap.

### Objectives

- Players manage an outpost and make real decisions about life support, shielding, power budgeting, food production and communication delay.
- Choices play out over a **simulated mission**: a decision that saves power today may cost oxygen tomorrow.
- **No free choice:** every option must carry a genuine trade-off.
- The player should walk away **understanding a real constraint** of deep-space survival, not just having played a fun game.
- Gameplay is grounded in **real NASA open data** rather than invented numbers.

### Design considerations from the brief

**Audience & accessibility**
- Ages 7–12, but able to flex to older siblings, parents and classrooms.
- Plain language; when a scientific term is unavoidable (radiation dose, microgravity, sol), explain it in context.
- Low barrier to entry: browser-playable, no download, no account.

**Real data**
- Use NASA public APIs and open datasets wherever possible — even one real radiation reading, Mars photo or astronaut health finding adds credibility.
- **Attribute data sources inside the tool.**
- If live API calls aren't feasible, embed a curated real dataset — but **never present static data as live**.

**Pitfalls to avoid**
- A "safe" choice with no cost.
- Visual polish replacing mechanical accuracy.
- Too many simultaneous systems: **2–3 core resources** (e.g. life support, power, shielding) beat 5–6.

**What makes a solution stand out**
- Showing the real-world link behind an in-game choice (e.g. a shielding decision tied to current space-weather data).
- Replayability: varying events/mechanics so kids try strategies and learn from failure without it feeling punitive.
- A short explanation of which NASA datasets were used and why, so judges can trace and verify the science.

## Data sources

### NASA

| Resource | What it gives us |
|---|---|
| [NASA Open APIs](https://api.nasa.gov/) | Central API portal (APOD, Mars Rover Photos, DONKI…). Free API key, higher rate limits than `DEMO_KEY`. |
| [DONKI — Space Weather Database](https://kauai.ccmc.gsfc.nasa.gov/DONKI/) | Solar flares, CMEs, solar energetic particle events → radiation risk, comms disruption. |
| [OSDR — Open Science Data Repository](https://osdr.nasa.gov/) | Space biology & astronaut health studies (bone density, muscle, immunity, sleep…). Keyword search API. |
| RadLab (OSDR Radiation Dosimetry Database) | Real dose measurements from ISS dosimeters (absorbed dose rate). |
| [Mars Trek](https://trek.nasa.gov/mars/) | Mars surface imagery, elevation and terrain from Curiosity, Perseverance and orbiters. |

### Partner agencies (CSA — Canadian Space Agency)

- **Space resources for STEM and youth organizations** — free bilingual activities for educators and youth groups.
- **Food production on the Moon and in remote areas** — toolkit on growing food in space, astronaut nutrition, and Earth benefits.

_NASA does not endorse any non-U.S. Government entity. For non-U.S. Government websites, follow each site's data-use terms._

## Our solution

_TBD — concept, gameplay, tech stack and how to run it will be documented here._

## Team

_TBD_
