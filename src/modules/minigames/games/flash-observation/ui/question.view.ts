import { drawOption, optionLabel } from './option.view';
import type { Question } from '../core/question';

const text = (content: string) => {
  const span = document.createElement('span');
  span.textContent = content;
  return span;
};

const drawPrompt = (question: Question) => {
  const prompt = document.createElement('p');
  prompt.className = 'mg-flash-observation-prompt';
  if (question.ask === 'notThere') prompt.append(text('Which was NOT there?'));
  else if (question.ask === 'howMany') prompt.append(text('How many'), drawOption(question.about));
  else prompt.append(text('Colour of'), drawOption(question.about));
  if (question.ask !== 'notThere') prompt.append(text('?'));
  return prompt;
};

const drawButton = (question: Question, index: number, onPick: (index: number) => void) => {
  const option = question.options[index];
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mg-flash-observation-answer';
  const key = document.createElement('span');
  key.className = 'mg-flash-observation-key';
  key.textContent = String(index + 1);
  if (option) {
    button.setAttribute('aria-label', optionLabel(option));
    button.append(key, drawOption(option));
  }
  button.addEventListener('click', () => onPick(index));
  return button;
};

/** Shows the question with one big button per option; returns the buttons in order. */
export const showQuestion = (
  stage: HTMLElement,
  question: Question,
  onPick: (index: number) => void,
): HTMLButtonElement[] => {
  const buttons = question.options.map((_option, index) => drawButton(question, index, onPick));
  const answers = document.createElement('div');
  answers.className = 'mg-flash-observation-answers';
  answers.append(...buttons);
  stage.replaceChildren(drawPrompt(question), answers);
  return buttons;
};

/** Locks the buttons, highlights the right one and the wrong pick if any. */
export const markAnswer = (buttons: readonly HTMLButtonElement[], answer: number, pick: number) =>
  buttons.forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle('mg-flash-observation-answer--right', index === answer);
    button.classList.toggle(
      'mg-flash-observation-answer--wrong',
      index === pick && pick !== answer,
    );
  });
