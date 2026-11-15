import type { GuidePage } from './scenario-content';

const LCROSS = {
  label: 'NASA · LCROSS finds water on the Moon (2009)',
  url: 'https://www.nasa.gov/news-release/lcross-impact-data-indicates-water-on-moon/',
};
const RASSOR = {
  label: 'NASA · RASSOR digging robot',
  url: 'https://technology.nasa.gov/patent/KSC-TOPS-7',
};
const LLCD = {
  label: 'NASA · Lunar Laser Communication Demonstration (2013)',
  url: 'https://www.nasa.gov/directorates/somd/space-communications-navigation-program/lunar-laser-communication-demonstration/',
};

/** Day one, first mission: the welcome to the station. */
export const EXCAVATOR_BRIEFING: GuidePage[] = [
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
            text: "We're near the Moon's south pole. Some craters there never see the Sun, and their cold ground hides ice!",
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
    text: 'Today, our robot must dig 50 kg of regolith: the dust and broken rock that cover the Moon. Press Launch mission when you are ready!',
  },
];

/** Day one, first mission: how the digging robot works, with real facts. */
export const EXCAVATOR_ACADEMY: GuidePage[] = [
  {
    kind: 'text',
    text: 'Welcome to the academy! Our robot is based on RASSOR, a real NASA digging robot. Its two drums spin in opposite directions.',
    source: RASSOR,
  },
  {
    kind: 'text',
    text: "Why two drums? On the Moon you weigh six times less than on Earth. One drum would push the light robot away; two opposite drums cancel each other's push.",
    source: RASSOR,
  },
  {
    kind: 'text',
    text: 'In 2009, NASA crashed the LCROSS rocket stage into a dark crater near the south pole. The cloud it raised contained water ice!',
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
    text: 'To drive: Z Q S D or the arrows. In the grey zone, hold Space to dig. In the orange zone, hold Space to unload.',
  },
  {
    kind: 'text',
    text: 'You drive the robot from inside the base, by remote control. Careful: rolling and spinning the drums drain its battery, and it cannot recharge today. Plan your moves!',
  },
];

/** Day one, second mission: sending the day's data home. */
export const LASER_BRIEFING: GuidePage[] = [
  {
    kind: 'text',
    text: 'Good job with the robot! Now the people on Earth want to know how our day went.',
  },
  {
    kind: 'choice',
    text: 'We will send them our pictures and readings. How do you think we send them?',
    options: [
      {
        label: 'By radio',
        reply: [
          {
            kind: 'text',
            text: 'Radio works, but it is slow for big pictures. We have something faster.',
          },
        ],
      },
      {
        label: 'With a laser',
        reply: [{ kind: 'text', text: 'Exactly! A laser beam can carry a lot of data.' }],
      },
    ],
  },
  {
    kind: 'text',
    text: "Today's job: aim the laser at Earth. Press Launch mission when you are ready.",
  },
];

/** Day one, second mission: why a laser, with real facts. */
export const LASER_ACADEMY: GuidePage[] = [
  {
    kind: 'text',
    text: 'Earth is about 384,400 km away. Light needs only about 1.3 seconds to get there!',
  },
  {
    kind: 'text',
    text: 'In 2013, NASA tested a laser link from a spacecraft orbiting the Moon. It sent data to Earth at 622 megabits per second.',
    source: LLCD,
  },
  {
    kind: 'question',
    text: 'What is the hard part with a laser?',
    answers: [
      {
        label: 'It must be aimed very precisely',
        correct: true,
        explanation:
          'Yes! The beam is thin, so it must hit the receiver exactly. Mirrors guide it.',
      },
      {
        label: 'It only works at night',
        correct: false,
        explanation: 'A laser works day and night. The hard part is aiming it.',
      },
      {
        label: 'It is too slow',
        correct: false,
        explanation: 'It is very fast! The hard part is aiming it.',
      },
    ],
  },
  {
    kind: 'text',
    text: 'Flip the mirrors to guide the beam to every receiver. Each flip costs the laser some power, so think first!',
  },
];

/** End of the act for now. */
export const MOON_ENDING: GuidePage[] = [
  { kind: 'text', text: 'What a first day! The base has regolith, and Earth got our news.' },
  {
    kind: 'text',
    text: 'New missions are on their way. Until then, you can start a new game and try to use even less air and power!',
  },
];
