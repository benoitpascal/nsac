import type { CampaignState } from '@/modules/scenario/core/campaign';
import { loadStarCatalog } from '@/modules/solar-system/infra/star-catalog';
import { mountPlanetWalk } from '@/modules/planet-walk/ui/planet-walk.view';
import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import {
  currentMission,
  dayDate,
  loseRescueHours,
  recordResult,
} from '@/modules/scenario/core/campaign';
import { BAG, TOOLS } from '@/modules/scenario/core/loadout';
import { DASHBOARD_PAGE } from '@/modules/scenario/core/mission-route';
import { EXCAVATOR_GOAL_KG, scoreExcavator } from '@/modules/scenario/core/scoring';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { requireElement } from '@/shared/dom';

const HOUR_MS = 3_600_000;
const params = new URLSearchParams(window.location.search);
let campaign: CampaignState | undefined = loadCampaign();

/**
 * The base clock: the game's current day (day one is the date the game started, day N is N − 1
 * days later) plus the hours lost in rescues, or `?time=<date>` to show another time of day.
 */
const startClock = () => {
  const openedAt = Date.now();
  const wanted = Date.parse(params.get('time') ?? '');
  const start = !Number.isNaN(wanted)
    ? wanted
    : campaign
      ? dayDate(campaign) + (campaign.hoursLost ?? 0) * HOUR_MS
      : openedAt;
  let skipped = 0;
  return {
    now: () => start + skipped + Date.now() - openedAt,
    skip: (ms: number) => (skipped += ms),
  };
};

const clock = startClock();
const mission = campaign && currentMission(MOON_ACT, campaign);
const playing =
  params.has('mission') && campaign?.stage === 'ready' && mission?.game.kind === 'walk';
const loadout = playing ? (campaign?.loadout ?? undefined) : undefined;

mountPlanetWalk(
  {
    canvas: requireElement<HTMLCanvasElement>('#planet-walk'),
    worldPicker: requireElement<HTMLElement>('#world-picker'),
    factsPanel: requireElement<HTMLElement>('#walk-facts'),
    viewToggle: requireElement<HTMLButtonElement>('#view-toggle'),
    pilotPrompt: requireElement<HTMLButtonElement>('#pilot-prompt'),
    dashboard: requireElement<HTMLElement>('#station-dashboard'),
    touchPad: requireElement<HTMLElement>('#touch-pad'),
    excavatorHud: requireElement<HTMLElement>('#excavator-hud'),
    suitHud: requireElement<HTMLElement>('#suit-hud'),
    rescueFade: requireElement<HTMLElement>('#rescue-fade'),
    missionHud: requireElement<HTMLElement>('#mission-hud'),
    missionFinish: requireElement<HTMLButtonElement>('#mission-finish'),
  },
  {
    loadStars: loadStarCatalog,
    now: clock.now,
    suitKit: loadout
      ? { oxygenBottles: loadout.oxygenBottles, extraItems: 1 + loadout.spareBatteries }
      : { oxygenBottles: 1, extraItems: 0 },
    onRescue: () => {
      clock.skip(4 * HOUR_MS);
      if (campaign) saveCampaign((campaign = loseRescueHours(campaign)));
      requireElement<HTMLElement>('#rescue-notice').hidden = false;
    },
    mission: loadout && {
      drums: TOOLS[loadout.tool],
      extraKwh: loadout.spareBatteries * BAG.chargeKwh,
      goalKg: EXCAVATOR_GOAL_KG,
      onEnd: ({ rescued, ...run }) => {
        if (!campaign) return;
        const result = scoreExcavator(run);
        saveCampaign(
          recordResult(campaign, { ...result, details: { ...result.details, rescued } }),
        );
        window.location.assign(DASHBOARD_PAGE);
      },
    },
  },
);
