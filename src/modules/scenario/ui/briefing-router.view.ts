import {
  confirmLoadout,
  continueAfterDebrief,
  currentMission,
  dayDate,
  finishAcademy,
  newCampaign,
  openAcademy,
  readBriefing,
  retryMission,
} from '../core/campaign';
import { debriefPages } from '../core/debrief-text';
import { DAY_PAGE, EXPLORE_PAGE, gamePage } from '../core/mission-route';
import { renderDashboard } from './dashboard.view';
import { button, el } from './dom';
import { playDialogue } from './guide-dialogue.view';
import { renderPreparation } from './preparation.view';
import type { CampaignState } from '../core/campaign';
import type { Act, GuidePage } from '../core/scenario-content';

export type BriefingDeps = {
  act: Act;
  load: () => CampaignState | undefined;
  save: (state: CampaignState) => void;
  now: () => number;
  navigate: (url: string) => void;
};

/**
 * The station dashboard page, driven by the saved game: the mascot on the left, and on the right
 * the screen of the current stage (welcome, dashboard, academy, bag, debrief, end of act).
 */
export const mountBriefing = (root: HTMLElement, deps: BriefingDeps) => {
  let state = deps.load() ?? newCampaign(deps.now());
  let stopDialogue: () => void = () => undefined;
  const mascot = el('img', 'guide__mascot');
  Object.assign(mascot, { src: '/arcadia/guide.png', alt: '' });
  const side = el('div', 'guide__side');
  root.replaceChildren(mascot, side);
  const update = (next: CampaignState) => {
    state = next;
    deps.save(state);
    render();
  };
  const talk = (pages: readonly GuidePage[], onEnd: () => void) => {
    const bubble = el('div', 'hud-panel guide__bubble');
    bubble.setAttribute('aria-live', 'polite');
    side.replaceChildren(bubble);
    stopDialogue = playDialogue(bubble, pages, onEnd);
  };
  const restart = () => update(newCampaign(deps.now()));
  const render = () => {
    stopDialogue();
    const mission = currentMission(deps.act, state);
    if (state.stage === 'dayEnd') return deps.navigate(DAY_PAGE);
    if (state.stage === 'actEnd' || !mission)
      return talk(deps.act.ending, () =>
        side.replaceChildren(button('New game', 'pill-button', restart)),
      );
    const dashboard = (launch: () => void) =>
      side.replaceChildren(
        renderDashboard(state, dayDate(state), mission, {
          launch,
          explore: () => deps.navigate(EXPLORE_PAGE),
          newGame: restart,
        }),
      );
    switch (state.stage) {
      case 'briefing':
        return talk(mission.briefing, () => update(readBriefing(state)));
      case 'dashboard':
        return dashboard(() => update(openAcademy(state)));
      case 'academy':
        return talk(mission.academy, () => update(finishAcademy(state, mission)));
      case 'preparation':
        return side.replaceChildren(
          renderPreparation(state.stores, (loadout) => {
            update(confirmLoadout(state, loadout));
            deps.navigate(gamePage(mission));
          }),
        );
      case 'ready':
        return dashboard(() => deps.navigate(gamePage(mission)));
      case 'debrief':
        return talk(
          debriefPages(
            state.lastResult ?? {
              missionId: '',
              verdict: 'unfinished',
              objectiveShare: 0,
              used: { air: 0, power: 0, water: 0 },
              details: {},
            },
          ),
          () => {
            const row = el('div', 'guide__actions');
            if (state.lastResult?.verdict !== 'efficient')
              row.append(
                button('Retry the mission', 'hud-back', () => update(retryMission(state, mission))),
              );
            row.append(
              button('Continue', 'hud-action', () => update(continueAfterDebrief(state, deps.act))),
            );
            side.replaceChildren(row);
          },
        );
    }
  };
  window.addEventListener('storage', () => {
    state = deps.load() ?? state;
    render();
  });
  deps.save(state);
  render();
};
