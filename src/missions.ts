import { mountActSelect } from '@/modules/act-select/ui/act-select.view';
import { requireElement } from '@/shared/dom';

mountActSelect({
  page: document.body,
  choices: [...document.querySelectorAll<HTMLButtonElement>('.act-choice')],
  start: requireElement<HTMLAnchorElement>('.cut-button--start'),
});
