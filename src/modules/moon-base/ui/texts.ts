import type { Specialty } from '../core/crew';
import type { Job } from '../core/jobs';

/** What each job is called on its button, and what it does in one short line. */
export const JOB_TEXTS: Record<Job, { label: string; help: string }> = {
  research: { label: 'Lab', help: 'Study Moon rocks to learn what Mars will need. Uses power.' },
  greenhouse: {
    label: 'Greenhouse',
    help: 'Plant food. It is ready to eat 2 days later. Uses power.',
  },
  oxygen: { label: 'Oxygen', help: 'Run the machine that makes oxygen from water. Uses power.' },
  solar: { label: 'Solar', help: 'Clean and turn the solar panels: they make more power today.' },
  rest: { label: 'Rest', help: 'Sleep and recover. Tired astronauts can only rest.' },
};

/** The specialty under each name, and the job it is best at. */
export const SPECIALTY_TEXTS: Record<Specialty, string> = {
  geology: 'Geologist · best in the lab',
  biology: 'Biologist · best in the greenhouse',
  engineering: 'Engineer · best on the solar panels',
  physics: 'Physicist · best in the lab',
  chemistry: 'Chemist · best at making oxygen',
  piloting: 'Pilot · helps anywhere',
};

/** The crew's message on each morning of the demo, from day 1. */
export const DAY_MESSAGES: readonly { title: string; text: string }[] = [
  {
    title: 'First full day',
    text:
      'Give each astronaut a job, then end the day. ' +
      'Tomorrow a crater rim will hide the Sun: keep some power in the battery!',
  },
  {
    title: 'Long shadows',
    text:
      'Near the south pole the Sun stays low. Today a crater rim hides it, ' +
      'so the panels make very little power.',
  },
  {
    title: 'Think ahead',
    text: 'Food from the greenhouse takes 2 days to grow. Plant early if you want to eat later.',
  },
  {
    title: 'Solar storm!',
    text: 'The Sun is throwing out fast particles. They are a kind of radiation, bad for the body.',
  },
  {
    title: 'Last day of the demo',
    text: 'The ship to Mars leaves tonight. Can your crew learn enough today?',
  },
];
