import type { GuidePage } from './scenario-content';

const LCROSS = {
  label: 'NASA · LCROSS finds water on the Moon (2009)',
  url: 'https://www.nasa.gov/news-release/lcross-impact-data-indicates-water-on-moon/',
};
const APOLLO_11 = {
  label: 'NASA · Apollo 11, Sea of Tranquility (1969)',
  url: 'https://www.nasa.gov/mission/apollo-11/',
};
const ORION_SHELTER = {
  label: 'NASA · Orion radiation protection plan',
  url: 'https://www.nasa.gov/missions/artemis/orion/scientists-and-engineers-evaluate-orion-radiation-protection-plan/',
};
const RADIATION_SHIELDING = {
  label: 'NASA · How to protect astronauts from space radiation',
  url: 'https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/',
};
const RASSOR = {
  label: 'NASA · RASSOR digging robot',
  url: 'https://technology.nasa.gov/patent/KSC-TOPS-7',
};
/** NASA's RASSOR 2.0 robot digging in a test bin (public domain, NASA image KSC-20160929-PH_DNG01_0001). */
const RASSOR_PHOTO = {
  src: '/arcadia/robots/rassor-nasa.webp',
  alt: "NASA's RASSOR robot: a small body on four wheels, with a big round digging drum at each end",
  credit: 'Photo: NASA / Dimitri Gerondidakis, RASSOR 2.0 test, 2016',
};

/** Day one: the welcome to the station, ending with the pick of the first job. */
export const DAY_ONE_OPENING: GuidePage[] = [
  {
    kind: 'text',
    text: "Hello, astronaut! Welcome to Arcadia, our base on the Moon. I'm your station assistant, and I'll help you all along.",
  },
  {
    kind: 'choice',
    text: 'Before we start, what would you like to know?',
    options: [
      {
        label: 'Who are you?',
        reply: [
          {
            kind: 'text',
            text: "I'm the base's helper robot. I watch the air, the power and the water, and I explain everything you need.",
          },
        ],
        goto: 'stay-alive',
      },
      {
        label: 'Where are we?',
        reply: [
          {
            kind: 'text',
            text: "We're near the Moon's equator, in the Sea of Tranquility, not far from where Apollo 11 landed in 1969. From here, the Earth never moves: it hangs high in the sky, day and night!",
            source: APOLLO_11,
          },
        ],
        goto: 'stay-alive',
      },
      {
        label: "Let's get to work!",
        reply: [{ kind: 'text', text: 'I like your energy! Just one quick question first.' }],
        goto: 'stay-alive',
      },
    ],
  },
  {
    kind: 'question',
    id: 'stay-alive',
    text: 'There is no air outside on the Moon. What does the crew need most to stay alive here?',
    answers: [
      {
        label: 'Air to breathe',
        correct: true,
        explanation: 'Yes! We make our own air, and we must not waste it.',
      },
      {
        label: 'Sand',
        correct: false,
        explanation: 'The Moon has plenty of dust, but nobody can breathe it.',
      },
      {
        label: 'Music',
        correct: false,
        explanation: 'Music is nice, but it will not keep us alive!',
      },
    ],
  },
  {
    kind: 'text',
    text: 'Watch three gauges on your dashboard: air, power and water. Every job uses some of them, so think before you act.',
  },
  {
    kind: 'text',
    text: 'Today we have two jobs. The robot must dig regolith, the dust and broken rock that covers the Moon. And our 3D printer must be tuned, so it can turn that regolith into bricks!',
    picture: RASSOR_PHOTO,
  },
  {
    kind: 'choice',
    text: 'You are the commander. What do you want to start with?',
    options: [
      {
        label: 'Dig regolith with the robot',
        reply: [{ kind: 'text', text: "Let's get that robot rolling!" }],
        effect: { kind: 'startMission', missionId: 'excavator' },
      },
      {
        label: 'Tune the 3D printer',
        reply: [{ kind: 'text', text: 'Good idea: a well-tuned printer wastes less regolith.' }],
        effect: { kind: 'startMission', missionId: 'printer' },
      },
    ],
  },
];

/** Day one, robot job: what it is about. */
export const EXCAVATOR_BRIEFING: GuidePage[] = [
  {
    kind: 'text',
    text: 'The robot must bring 50 kg of regolith to the base. Before you drive it, a quick lesson at the academy!',
    picture: RASSOR_PHOTO,
  },
];

/** Day one, first mission: how the digging robot works, with real facts. */
export const EXCAVATOR_ACADEMY: GuidePage[] = [
  {
    kind: 'text',
    text: 'Welcome to the academy! Our robot is based on RASSOR, a real NASA digging robot. Its two drums spin in opposite directions.',
    source: RASSOR,
    picture: RASSOR_PHOTO,
  },
  {
    kind: 'text',
    text: "Why two drums? On the Moon you weigh six times less than on Earth. One drum would push the light robot away; two opposite drums cancel each other's push.",
    source: RASSOR,
  },
  {
    kind: 'text',
    text: 'In 2009, NASA crashed the LCROSS rocket stage into a dark crater near the south pole. The cloud it raised contained water ice! Our ground here holds much less, but our drums can still dig a little out.',
    source: LCROSS,
  },
  {
    kind: 'question',
    text: 'Why is ice in the regolith so precious for the base?',
    answers: [
      {
        label: 'It gives water, and we can split water into air',
        correct: true,
        explanation: 'Right! With electricity we split water into oxygen to breathe and hydrogen.',
      },
      {
        label: 'It keeps food cold',
        correct: false,
        explanation:
          'Fridges are easy here. The ice is much more useful: it is water, and water gives oxygen.',
      },
    ],
  },
  {
    kind: 'text',
    text: 'To drive: the arrow keys, or W A S D (Z Q S D on a French keyboard). In the yellow zone, hold Space to dig. In the red zone, hold Space to unload.',
  },
  {
    kind: 'text',
    text: 'You drive the robot from inside the base, by remote control. Careful: rolling and spinning the drums drain its battery, and it cannot recharge today. Plan your moves!',
  },
];

/** Day one, printer job: what it is about. */
export const PRINTER_BRIEFING: GuidePage[] = [
  {
    kind: 'text',
    text: 'Our 3D printer melts regolith into bricks with a laser beam. Before it can print, its laser must be aimed just right.',
  },
  {
    kind: 'choice',
    text: 'Why make bricks here instead of bringing them from Earth?',
    options: [
      {
        label: 'Rockets cannot carry much',
        reply: [
          {
            kind: 'text',
            text: 'Exactly! Every kilogram sent to the Moon costs a lot. Regolith is already here.',
          },
        ],
      },
      {
        label: 'Bricks from Earth would break',
        reply: [
          {
            kind: 'text',
            text: 'Not really. The real reason: rockets can carry only a little, and regolith is free here.',
          },
        ],
      },
    ],
  },
];

/** Day one, printer job: how a printer can use regolith. */
export const PRINTER_ACADEMY: GuidePage[] = [
  {
    kind: 'text',
    text: 'NASA is testing machines that heat regolith until its grains stick together, to build landing pads and walls on the Moon.',
  },
  {
    kind: 'text',
    text: 'Our printer does it with a laser. Mirrors guide the beam to the right spot, like light bouncing off a bathroom mirror.',
  },
  {
    kind: 'question',
    text: 'What happens if the printer is badly tuned?',
    answers: [
      {
        label: 'It wastes regolith',
        correct: true,
        explanation: 'Yes! A badly aimed laser melts the wrong spots, so fewer bricks come out.',
      },
      {
        label: 'It makes more bricks',
        correct: false,
        explanation: 'No, the opposite: a badly aimed laser wastes regolith.',
      },
    ],
  },
  {
    kind: 'text',
    text: 'Flip the mirrors to guide the beam to every target. Each flip uses the laser, so think before you flip!',
  },
];

/** Day two: the morning talk before planning the base's work. */
export const DAY_TWO_OPENING: GuidePage[] = [
  {
    kind: 'text',
    text: 'Good morning, commander! Day two. Today, you decide what the crew works on.',
  },
  {
    kind: 'text',
    text: 'Every job costs bricks, power or water. Some jobs are too expensive for now: you will see them greyed out, with what is missing.',
  },
  {
    kind: 'question',
    text: 'Mission control advises a shelter. What could the crew need to hide from on the Moon?',
    answers: [
      {
        label: 'Particles thrown out by the Sun',
        correct: true,
        explanation:
          'Yes! The Sun sometimes throws out a storm of fast particles. On the Moon, there is no air to stop them.',
      },
      {
        label: 'Rain',
        correct: false,
        explanation:
          'There is no rain on the Moon: there is no air at all. The danger comes from the Sun.',
      },
      {
        label: 'Moon animals',
        correct: false,
        explanation: 'Nothing lives on the Moon. The danger comes from the Sun.',
      },
    ],
  },
  { kind: 'text', text: 'Now look at the plan, and choose what you want to do today.' },
];

/** Day two, shelter build: what it is about. */
export const SHELTER_BRIEFING: GuidePage[] = [
  {
    kind: 'text',
    text: "We build the shelter with the bricks the printer made. Thick walls slow down the Sun's particles.",
  },
];

/** Day two, shelter build: how a shelter protects, with real facts. */
export const SHELTER_ACADEMY: GuidePage[] = [
  {
    kind: 'text',
    text: 'Water and materials full of hydrogen block radiation well. That is why space shelters use them.',
    source: RADIATION_SHIELDING,
  },
  {
    kind: 'text',
    text: "On NASA's Orion spacecraft, if a solar storm comes, the crew builds a shelter with bags of food and water, and hides inside.",
    source: ORION_SHELTER,
  },
  {
    kind: 'text',
    text: 'Our crane lifts the bricks into place. Hang every weight on the crane arm and keep the arm level. Fewer moves, fewer bricks wasted!',
  },
];

/** End of the act for now. */
export const MOON_ENDING: GuidePage[] = [
  {
    kind: 'text',
    text: 'What a start! The base has bricks, and the crew knows how to protect itself.',
  },
  {
    kind: 'text',
    text: 'New missions are on their way. Until then, you can start a new game and try to use even less air and power!',
  },
];
