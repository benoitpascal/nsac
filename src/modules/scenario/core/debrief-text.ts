import type { MissionResult } from './campaign';
import type { GuidePage } from './scenario-content';

const HEADLINES = {
  efficient: 'Mission accomplished, and you saved the base resources. Great planning!',
  wasteful: 'Mission accomplished, but it cost the base a lot.',
  unfinished: 'The mission is not finished this time. That is okay: let us see what happened.',
};

/** Returns the mascot's debrief: the verdict, what was used, the main reason and a real-life link. */
export const debriefPages = (result: MissionResult): GuidePage[] => {
  const { air, power, water } = result.used;
  const pages: GuidePage[] = [
    { kind: 'text', text: HEADLINES[result.verdict] },
    {
      kind: 'text',
      text: `The base used ${air} points of air and ${power} points of power${water < 0 ? `, and gained ${-water} points of water from the ice in the regolith` : ''}.`,
    },
  ];
  if (result.details.rescued)
    pages.push({
      kind: 'text',
      text: 'Your suit ran low, so the crew brought you back inside. Next time, watch your oxygen and battery and come back earlier.',
    });
  if (result.missionId === 'excavator' && result.verdict !== 'efficient')
    pages.push({
      kind: 'text',
      text: 'Most of the power went into driving and digging. Fewer moves and fuller loads between the grey and orange zones save the robot battery.',
    });
  if (result.missionId === 'laser-comms' && result.verdict !== 'efficient')
    pages.push({
      kind: 'text',
      text: 'Every mirror flip used the laser. Think about the beam path before flipping.',
    });
  pages.push({
    kind: 'text',
    text: 'Real astronauts plan every move, because air and power are precious far from Earth.',
  });
  return pages;
};
