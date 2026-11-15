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
import { dayObjectives } from '../core/progress';
import { controlRow } from './control-row.view';
import { renderDashboard } from './dashboard.view';
import { renderTerminalMenu } from './terminal-menu.view';
import { createVoiceSpeaker } from './voice-speaker.view';
import { button, cutButton, el } from './dom';
import { playDialogue } from './guide-dialogue.view';
import { renderPlanning } from './planning.view';
import { renderPreparation } from './preparation.view';
import type { CampaignState } from '../core/campaign';
import type { Act, DialogueEffect, GuidePage, Mission } from '../core/scenario-content';
import type { Voice } from '../core/voice';

/** The comic-strip tail drawn from the mascot's hand toward its card (Figma « Vector 19 »). */
const TAIL =
  '<svg class="guide__tail" viewBox="0 0 74.5 21.2" preserveAspectRatio="none" aria-hidden="true"><polyline points="19.4,0 0,21.2 74.5,4.8" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>';

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
  /** Opens on the terminal's menu (when walking up to it) rather than on the mascot. */
  menuFirst?: boolean;
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
  const figure = el('figure', 'guide__figure');
  figure.innerHTML = TAIL;
  figure.prepend(mascot);
  if (deps.voice) figure.append(createVoiceSpeaker(deps.voice).speaker);
  const side = el('div', 'guide__side');
  const leave = () => deps.navigate(EXPLORE_PAGE);
  /** The control row under a screen without its own: Back to the terminal menu, then Leave. */
  const controls = () => controlRow({ back: () => showMenu(), leave });
  const showGuide = () => {
    root.className = 'guide';
    root.replaceChildren(figure, side);
  };
  const showMenu = () => {
    stopDialogue();
    root.className = 'briefing';
    renderTerminalMenu(root, {
      day: () => state.dayIndex + 1,
      objectives: () => dayObjectives(deps.act, state),
      stores: () => state.stores,
      voice: deps.voice,
      leave,
      continueMission: () => {
        showGuide();
        render();
      },
    });
  };
  showGuide();
  const update = (next: CampaignState) => {
    state = next;
    deps.save(state);
    render();
  };
  const talk = (pages: readonly GuidePage[], onEnd: (effect?: DialogueEffect) => void) => {
    const bubble = el('div', 'hud-panel guide__bubble');
    bubble.setAttribute('aria-live', 'polite');
    const actions = el('div', 'guide__actions');
    side.replaceChildren(bubble, actions);
    stopDialogue = playDialogue(bubble, actions, pages, onEnd, deps.voice, showMenu, leave);
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
      const retry = cutButton('Retry the mission', 'wide', () =>
        update(retryMission(state, mission)),
      );
      retry.disabled = result.verdict === 'efficient';
      side.replaceChildren(
        controlRow({
          leave,
          actions: [
            retry,
            cutButton('Continue', 'wide', () => update(continueAfterDebrief(state, deps.act))),
          ],
        }),
      );
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
        ...renderPreparation(state.stores, (loadout) => {
          update(confirmLoadout(state, loadout));
          launch();
        }),
        controls(),
      );
    if (state.stage === 'debrief') return showDebrief(mission);
    side.replaceChildren(
      renderDashboard(state, deps.act, {
        launch,
        back: showMenu,
        leave,
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
        controls(),
      );
    const mission = currentMission(deps.act, state);
    if (state.stage === 'actEnd' || !mission)
      return talk(deps.act.ending, () =>
        side.replaceChildren(button('New game', 'hud-action', restart), controls()),
      );
    showMissionStage(mission);
  };
  window.addEventListener('storage', () => {
    state = deps.load() ?? state;
    if (!root.querySelector('.terminal-menu')) render();
  });
  deps.save(state);
  if (!deps.menuFirst) return render();
  deps.onState?.(state);
  showMenu();
};
