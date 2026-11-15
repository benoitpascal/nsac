import { startBase } from '@/modules/moon-base/core/base-state';
import {
  clearBase,
  loadBase,
  loadRegolith,
  saveBase,
} from '@/modules/moon-base/infra/campaign-store';
import { mountMoonBase } from '@/modules/moon-base/ui/moon-base.view';
import { requireElement } from '@/shared/dom';

mountMoonBase(
  {
    status: requireElement<HTMLElement>('#base-status'),
    event: requireElement<HTMLElement>('#base-event'),
    crew: requireElement<HTMLElement>('#base-crew'),
    jobsHelp: requireElement<HTMLElement>('#base-jobs-help'),
    forecast: requireElement<HTMLElement>('#base-forecast'),
    endButton: requireElement<HTMLButtonElement>('#base-end-day'),
    report: requireElement<HTMLDialogElement>('#base-report'),
    actEnd: requireElement<HTMLDialogElement>('#base-act-end'),
  },
  loadBase() ?? startBase(loadRegolith()),
  {
    save: saveBase,
    restart: () => {
      clearBase();
      return startBase(loadRegolith());
    },
  },
);
