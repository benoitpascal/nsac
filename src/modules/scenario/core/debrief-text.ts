import { qualityOf } from './quality';
import { GREENHOUSE } from './greenhouse-scoring';
import type { MissionResult } from './campaign';
import type { GuidePage } from './scenario-content';

const HEADLINES = {
  efficient: 'Mission accomplished, and you saved the base resources. Great planning!',
  wasteful: 'Mission accomplished, but it cost the base a lot.',
  unfinished: 'The mission is not finished this time. That is okay: let us see what happened.',
};

/** What the irrigation gave, by how well the pipes were laid (amounts from scoring's GREENHOUSE). */
const greenhouseLine = (result: MissionResult) => {
  if (!result.details.won) return 'The seeds got no water this time, so nothing will grow yet.';
  const quality = qualityOf(result.details.score ?? 0);
  if (quality === 'optimal')
    return `The water reaches every seed tray, with no leak. The plants will give ${GREENHOUSE.food.optimal} points of food!`;
  if (quality === 'partial')
    return `The seeds are watered, but ${GREENHOUSE.leakedWater.partial} points of water leaked. Fewer turns of the pipes save water.`;
  return `The pipes leaked ${GREENHOUSE.leakedWater.failed} points of water, and only half the seeds got some. Think about the water's path before turning a pipe.`;
};

/** Returns the mascot's debrief: the verdict, what was used, the main reason and a real-life link. */
export const debriefPages = (result: MissionResult): GuidePage[] => {
  const { power = 0, water = 0 } = result.used;
  const pages: GuidePage[] = [{ kind: 'text', text: HEADLINES[result.verdict] }];
  if (power > 0 || water < 0)
    pages.push({
      kind: 'text',
      text: `Your mission used ${power} points of the base's power${water < 0 ? `, and gained ${-water} points of water from the ice in the regolith` : ''}.`,
    });
  if (result.details.rescued)
    pages.push({
      kind: 'text',
      text: 'Your suit ran low, so the crew brought you back inside. Next time, watch your oxygen and battery and come back earlier.',
    });
  if (result.missionId === 'excavator' && result.verdict !== 'efficient')
    pages.push({
      kind: 'text',
      text: 'Most of the power went into driving and digging. Fewer moves and fuller loads between the yellow and red zones save the robot battery.',
    });
  if (result.missionId === 'printer' && result.verdict !== 'efficient')
    pages.push({
      kind: 'text',
      text: 'Every mirror flip used the laser, and a rough tuning means fewer bricks. Think about the beam path before flipping.',
    });
  if (result.missionId === 'shelter')
    pages.push({
      kind: 'text',
      text:
        result.shelterQuality === 'optimal'
          ? 'The shelter is finished, with no brick wasted. The crew has a safe place now.'
          : result.shelterQuality === 'partial'
            ? 'The shelter is finished, but 2 bricks were wasted. Fewer moves on the crane save bricks.'
            : 'The shelter is not finished, and 2 bricks were lost. Without it, the crew has nowhere safe to hide.',
    });
  if (result.missionId === 'greenhouse') pages.push({ kind: 'text', text: greenhouseLine(result) });
  pages.push({
    kind: 'text',
    text: 'Real astronauts plan every move, because air and power are precious far from Earth.',
  });
  return pages;
};
