import {
  chooseMission,
  closeDay,
  confirmLoadout,
  continueAfterDebrief,
  currentMission,
  finishAcademy,
  missionsLeft,
  newCampaign,
  retryMission,
  startPlanning,
} from '../core/campaign';
import { chooseAction } from '../core/actions';
import { dayClosingPages } from '../core/day-closing';
import { debriefPages } from '../core/debrief-text';
import { DAY_PAGE, EXPLORE_PAGE, gamePage } from '../core/mission-route';
import { renderDashboard } from './dashboard.view';
import { button, el } from './dom';
import { playDialogue } from './guide-dialogue.view';
import { renderPlanning } from './planning.view';
import { renderPreparation } from './preparation.view';
import type { CampaignState } from '../core/campaign';
import type { Act, DialogueEffect, GuidePage, Mission } from '../core/scenario-content';
import type { Voice } from '../core/voice';

export type BriefingDeps = {
  act: Act;
  load: () => CampaignState | undefined;
  save: (state: CampaignState) => void;
  now: () => number;
  navigate: (url: string) => void;
  /** Called with the saved game each time the terminal shows a new stage. */
  onState?: (state: CampaignState) => void;
  /** The mascot's voice; without it the mascot only writes. */
  voice?: Voice;
};

/** Puts a sound on / off button over the mascot when it has a voice. */
const withVoiceToggle = (mascot: HTMLElement, voice: Voice | undefined) => {
  if (!voice) return mascot;
  const label = () => (voice.isMuted() ? 'Sound off' : 'Sound on');
  const toggle = button(label(), 'hud-secondary guide__voice', () => {
    voice.setMuted(!voice.isMuted());
    toggle.textContent = label();
    toggle.setAttribute('aria-pressed', String(!voice.isMuted()));
  });
  toggle.setAttribute('aria-pressed', String(!voice.isMuted()));
  const box = el('div', 'guide__mascot-box');
  box.append(mascot, toggle);
  return box;
};

/**
 * The base terminal, driven by the saved game: the mascot on the left, and on the right the
 * discussion of the current stage (the day's opening and the pick of a job, academy, bag,
 * debrief, end of the day, end of the act), or the dashboard when a mission is ready to launch.
 */
export const mountBriefing = (root: HTMLElement, deps: BriefingDeps) => {
  let state = deps.load() ?? newCampaign(deps.now());
  let stopDialogue: () => void = () => undefined;
  const mascot = el('img', 'guide__mascot');
  Object.assign(mascot, { src: '/arcadia/guide.png', alt: '' });
  const side = el('div', 'guide__side');
  root.replaceChildren(withVoiceToggle(mascot, deps.voice), side);
  const update = (next: CampaignState) => {
    state = next;
    deps.save(state);
    render();
  };
  const talk = (pages: readonly GuidePage[], onEnd: (effect?: DialogueEffect) => void) => {
    const bubble = el('div', 'hud-panel guide__bubble');
    bubble.setAttribute('aria-live', 'polite');
    side.replaceChildren(bubble);
    stopDialogue = playDialogue(bubble, pages, onEnd, deps.voice);
  };
  const restart = () => update(newCampaign(deps.now()));
  const today = () => deps.act.days[state.dayIndex];
  const openDay = () =>
    talk(today()?.opening ?? [], (effect) => {
      if (today()?.planning) return update(startPlanning(state, deps.act));
      const picked =
        effect?.kind === 'startMission' ? effect.missionId : missionsLeft(deps.act, state)[0]?.id;
      if (picked) update(chooseMission(state, deps.act, picked));
    });
  const closeTheDay = () =>
    talk(dayClosingPages(state, today() ?? deps.act.days[0]), (effect) =>
      update(closeDay(state, effect?.kind === 'printBricks')),
    );
  const showDebrief = (mission: Mission) => {
    if (!state.lastResult) return update(continueAfterDebrief(state, deps.act));
    const result = state.lastResult;
    talk(debriefPages(result), () => {
      const row = el('div', 'guide__actions');
      if (result.verdict !== 'efficient')
        row.append(
          button('Retry the mission', 'hud-secondary', () => update(retryMission(state, mission))),
        );
      row.append(
        button('Continue', 'hud-action', () => update(continueAfterDebrief(state, deps.act))),
      );
      side.replaceChildren(row);
    });
  };
  const showMissionStage = (mission: Mission) => {
    const launch = () => deps.navigate(gamePage(mission));
    if (state.stage === 'academy')
      return talk([...mission.briefing, ...mission.academy], () =>
        update(finishAcademy(state, mission)),
      );
    if (state.stage === 'preparation')
      return side.replaceChildren(
        renderPreparation(state.stores, (loadout) => {
          update(confirmLoadout(state, loadout));
          launch();
        }),
      );
    if (state.stage === 'debrief') return showDebrief(mission);
    side.replaceChildren(
      renderDashboard(state, deps.act, {
        launch,
        explore: () => deps.navigate(EXPLORE_PAGE),
        newGame: restart,
      }),
    );
  };
  const render = () => {
    stopDialogue();
    deps.onState?.(state);
    if (state.stage === 'dayEnd') return deps.navigate(DAY_PAGE);
    if (state.stage === 'briefing') return openDay();
    if (state.stage === 'dayClosing') return closeTheDay();
    if (state.stage === 'planning')
      return side.replaceChildren(
        renderPlanning(state, (action) => update(chooseAction(state, deps.act, action))),
      );
    const mission = currentMission(deps.act, state);
    if (state.stage === 'actEnd' || !mission)
      return talk(deps.act.ending, () =>
        side.replaceChildren(button('New game', 'hud-action', restart)),
      );
    showMissionStage(mission);
  };
  window.addEventListener('storage', () => {
    state = deps.load() ?? state;
    render();
  });
  deps.save(state);
  render();
};
